import { inspect } from "node:util";
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

type ChannelSettingsMinimal = Awaited<
  ReturnType<typeof GuildSettingsService.channels.getAllEnabledTempaltes>
>[number];

async function updateGuildChannel(
  guild: Guild,
  guildSettings: GuildSettingsData,
  channelSettings: ChannelSettingsMinimal,
  i18n: Awaited<ReturnType<typeof initI18n>>,
  logger: typeof originalLogger,
) {
  logger.debug(`Starting update for channel`);

  logger.debug(`Fetching channel`);
  const channel = await guild.channels.fetch(channelSettings.discordChannelId);

  if (!channel) {
    logger.debug(`Channel not found`);
    return;
  }

  if (!botHasPermsToEdit(channel)) {
    logger.debug(`Bot doesn't have permissions to edit channel`);
    const error = new KnownError("NO_ENOUGH_PERMISSIONS_TO_EDIT_CHANNEL");

    GuildSettingsService.channels.logs
      .set(channel.id, {
        LastTemplateUpdateDate: new Date(),
        LastTemplateComputeError: error.message,
      })
      .catch(logger.error);
    throw error;
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

async function updateGuildChannels(
  guild: Guild,
  guildSettings: GuildSettingsData,
  channelsSettings: ChannelSettingsMinimal[],
  guildLogger: Logger,
) {
  guildLogger.debug(`Init i18n`);
  const i18n = await initI18n({ locale: guild.preferredLocale });

  guildLogger.debug(`Processing ${channelsSettings.length} channels`);

  await Promise.allSettled(
    channelsSettings.map(async (channelSettings) => {
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

  const guildIds = client.guilds.cache
    .filter((guild) => guild.available)
    .map(({ id }) => id);

  if (!guildIds.length) return;

  const evaluationPriorities = await redis.mget(
    ...guildIds.map((id) => advertiseEvaluatorPriorityKey(id)),
  );

  const guildsToHandle = guildIds.filter((id, index) => {
    const priority = evaluationPriorities[index];
    if (priority === null) {
      return false;
    } else {
      return Number(priority) <= dataSourceComputePriority;
    }
  });

  let debugCheckCount = 0;
  const guildsToProccessLeft = new Set<string>(guildsToHandle);
  const guildsToProcessSize = guildsToProccessLeft.size;

  const debugInterval = setInterval(() => {
    if (guildsToProccessLeft.size <= guildsToProcessSize * 0.05) {
      logger.debug(
        `Almost done, ${guildsToProccessLeft.size} guilds left: ${Array.from(guildsToProccessLeft).join(", ")}`,
      );
    }
  }, 5_000);

  logger.debug(
    `Fetching guilds settings for ${guildsToHandle.length} guilds`,
    logger,
  );
  const guildsSettings = await GuildSettingsService.getMany(guildsToHandle);
  logger.debug(`Fetched guilds settings for ${guildsToHandle.length} guilds`);

  logger.debug(
    `Fetching channels settings for ${guildsToHandle.length} guilds`,
    logger,
  );
  const channelsSettings =
    await GuildSettingsService.channels.getAllEnabledTempaltes(guildsToHandle);
  logger.debug(`Fetched channels settings for ${guildsToHandle.length} guilds`);

  await Promise.allSettled(
    guildsToHandle.map(async (guildId) => {
      const guildLogger = logger.child({
        guild: guildId,
      });

      const guildSettings = guildsSettings.find(
        (guildSettings) => guildSettings.discordGuildId === guildId,
      );
      if (!guildSettings) {
        return;
      }

      const guildChannelSettings = channelsSettings.filter(
        (channelSettings) => channelSettings.discordGuildId === guildId,
      );

      if (!guildChannelSettings.length) {
        return;
      }

      const guild = client.guilds.cache.get(guildId);

      if (!guild) {
        return;
      }

      await updateGuildChannels(
        guild,
        guildSettings,
        guildChannelSettings,
        guildLogger,
      )
        .then(() => {
          logger.debug(
            `Updated guild channels (${++debugCheckCount}/${guildsToHandle.length})`,
          );
        })
        .catch((error) => {
          logger.error(
            `Error while trying to update channels, error ${inspect(error)}`,
          );
        })
        .finally(() => {
          guildsToProccessLeft.delete(guildId);
        });
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
