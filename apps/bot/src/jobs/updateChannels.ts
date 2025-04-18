import { inspect } from "node:util";
import type { Channel } from "@mc/db";
import type originalLogger from "@mc/logger";
import type { GuildSettingsData } from "@mc/services/guildSettings";
import type { Client, Guild } from "discord.js";
import type { Logger } from "winston";
import { ChannelType } from "discord.js";

import { Job } from "@mc/common/bot/structures//Job";
import {
  advertiseEvaluatorPriorityKey,
  discordAPIIntensiveOperationLockKey,
  updateChannelsQueueKey,
} from "@mc/common/redis/keys";
import { redis } from "@mc/redis";
import DataSourceService from "@mc/services/DataSource/index";
import { GuildSettingsService } from "@mc/services/guildSettings";

import { initI18n } from "~/i18n";
import botHasPermsToEdit from "~/utils/botHasPermsToEdit";
import { makeIsValidChild } from "~/utils/isValidChildId";
import { withQueueLock } from "~/utils/withQueueLock";

async function updateGuildChannel(
  guild: Guild,
  guildSettings: GuildSettingsData,
  channelSettings: Channel,
  i18n: Awaited<ReturnType<typeof initI18n>>,
  logger: typeof originalLogger,
) {
  logger.debug(`Starting update for channel`);

  if (!channelSettings.isTemplateEnabled) {
    logger.debug(`Template disabled for channel`);
    return;
  }

  logger.debug(`Fetching channel`);
  const channel = await guild.channels.fetch(channelSettings.discordChannelId);

  if (!channel) {
    logger.debug(`Channel not found`);
    return;
  }

  if (!botHasPermsToEdit(channel)) {
    logger.debug(`Bot doesn't have permissions to edit channel`);

    return;
  }

  logger.debug(`Creating DataSourceService for channel`);
  const dataSourceService = new DataSourceService({
    guild: channel.guild,
    guildSettings,
    channelType: channel.type,
  });

  logger.debug(`Evaluating template for channel`);
  const computedTemplate = await dataSourceService
    .evaluateTemplate(channelSettings.template)
    .then((computed) => {
      logger.debug(`Template evaluation successful for channel`);
      GuildSettingsService.channels.logs
        .set(channel.id, {
          LastTemplateUpdateDate: new Date(),
          LastTemplateComputeError: null,
        })
        .catch(logger.error);

      return computed;
    })
    .catch((error) => {
      logger.debug(
        `Template evaluation failed for channel, error: ${inspect(error)}`,
      );
      if (error instanceof Error) {
        GuildSettingsService.channels.logs
          .set(channel.id, {
            LastTemplateUpdateDate: new Date(),
            LastTemplateComputeError: error.message,
          })
          .catch(logger.error);
      }

      return i18n.t("jobs.updateChannels.computeError");
    });

  if (
    channel.type === ChannelType.GuildText ||
    channel.type === ChannelType.GuildAnnouncement
  ) {
    if (channel.topic === computedTemplate) {
      logger.debug(`Topic unchanged for channel`);
      return;
    }
    logger.debug(`Updating topic for channel`);
    await channel.edit({ topic: computedTemplate });
  } else {
    if (channel.name === computedTemplate) {
      logger.debug(`Name unchanged for channel`);
      return;
    }
    logger.debug(`Updating name for channel`);
    await channel.edit({ name: computedTemplate });
  }
}

async function updateGuildChannels(guild: Guild, guildLogger: Logger) {
  if (!guild.available) return;

  guildLogger.debug(`Fetching settings for guild`);
  const guildSettings = await GuildSettingsService.upsert(guild.id);

  guildLogger.debug(`Fetching settings for guild's channels`);
  const guildChannelsSettings = await GuildSettingsService.channels.getAll(
    guild.id,
  );

  guildLogger.debug(`Init i18n`);
  const i18n = await initI18n({ locale: guild.preferredLocale });

  guildLogger.debug(`Processing ${guildChannelsSettings.length} channels`);

  await Promise.allSettled(
    guildChannelsSettings.map(async (channelSettings) => {
      const channelLogger = guildLogger.child({
        channel: channelSettings.discordChannelId,
      });

      channelLogger.debug(`Updating channel"`);
      await updateGuildChannel(
        guild,
        guildSettings,
        channelSettings,
        i18n,
        channelLogger,
      );
      channelLogger.debug(`Finished updating channel`);
    }),
  );
}

const task = async (client: Client, logger: Logger) => {
  const { dataSourceComputePriority } = client.botInstanceOptions;

  let debugCheckCount = 0;
  const guildsToProccessLeft = new Set<string>(client.guilds.cache.keys());
  const guildsToProcessSize = guildsToProccessLeft.size;

  const debugInterval = setInterval(() => {
    if (guildsToProccessLeft.size <= guildsToProcessSize * 0.05) {
      logger.debug(
        `Almost done, ${guildsToProccessLeft.size} guilds left: ${Array.from(guildsToProccessLeft).join(", ")}`,
      );
    }
  }, 5_000);

  await Promise.allSettled(
    client.guilds.cache.map(async (guild, _key, collection) => {
      const guildLogger = guild.client.botInstanceOptions.logger.child({
        guild: guild.id,
      });

      try {
        const handledPriority = Number(
          await redis.get(advertiseEvaluatorPriorityKey(guild.id)),
        );

        guildLogger.debug(`Compute priority is ${handledPriority}`);

        if (handledPriority > dataSourceComputePriority) {
          logger.debug(
            `Guild has a higher priority (${handledPriority}) than the bot (${dataSourceComputePriority}). Skipping...`,
          );
          return;
        }

        await updateGuildChannels(guild, guildLogger);

        logger.debug(
          `Updated guild channels (${++debugCheckCount}/${collection.size})`,
        );
      } catch (error) {
        logger.error(
          `Error while trying to update channels, error ${inspect(error)}`,
        );
      } finally {
        guildsToProccessLeft.delete(guild.id);
      }
    }),
  );

  clearInterval(debugInterval);
};

export const updateChannels = (client: Client) => {
  return new Job({
    name: "Update channels",
    time: client.botInstanceOptions.isPremium
      ? "0 */5 * * * *"
      : "0 */10 * * * *",
    execute: async (client) => {
      const { id, childId } = client.botInstanceOptions;

      const logger = client.botInstanceOptions.logger.child({
        task: "Update channels",
      });

      const queueKey = updateChannelsQueueKey(id);
      const lockKey = discordAPIIntensiveOperationLockKey(id);

      await withQueueLock({
        queueKey,
        lockKey,
        queueEntryId: childId,
        isValidEntry: makeIsValidChild(client.botInstanceOptions),
        logger: logger,
        task: () => task(client, logger),
      });
    },
  });
};
