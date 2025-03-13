import { setTimeout as sleep } from "timers/promises";
import type { Client, Guild } from "discord.js";
import { Redlock } from "@sesamecare-oss/redlock";
import { ChannelType } from "discord.js";

import { Job } from "@mc/common/bot/structures//Job";
import { KnownError } from "@mc/common/KnownError/index";
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

async function updateGuildChannels(
  guild: Guild,
  extendLock: () => Promise<void>,
) {
  if (!guild.available) return;

  const { logger } = guild.client.botInstanceOptions;

  const guildSettings = await GuildSettingsService.upsert(guild.id);
  const guildChannelsSettings = await GuildSettingsService.channels.getAll(
    guild.id,
  );
  const i18n = await initI18n(guild.preferredLocale);

  await Promise.all(
    guildChannelsSettings.map(async (channelSettings) => {
      if (!channelSettings.isTemplateEnabled) return;

      const channel = await guild.channels.fetch(
        channelSettings.discordChannelId,
      );

      if (!channel) return;
      if (!botHasPermsToEdit(channel)) {
        await GuildSettingsService.channels.logs
          .set(channel.id, {
            LastTemplateUpdateDate: new Date(),
            LastTemplateComputeError: new KnownError(
              "NO_ENOUGH_PERMISSIONS_TO_EDIT_CHANNEL",
            ).message,
          })
          .catch(logger.error);

        return;
      }

      const dataSourceService = new DataSourceService({
        guild: channel.guild,
        guildSettings,
        channelType: channel.type,
      });

      const computedTemplate = await dataSourceService
        .evaluateTemplate(channelSettings.template)
        .then((computed) => {
          GuildSettingsService.channels.logs
            .set(channel.id, {
              LastTemplateUpdateDate: new Date(),
              LastTemplateComputeError: null,
            })
            .catch(logger.error);

          return computed;
        })
        .catch((error) => {
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
        if (channel.topic === computedTemplate) return;
        await channel.edit({ topic: computedTemplate });
      } else {
        if (channel.name === computedTemplate) return;
        await channel.edit({ name: computedTemplate });
      }

      await extendLock();
    }),
  );
}

export const updateChannels = (client: Client) => {
  return new Job({
    name: "Update channels",
    time: client.botInstanceOptions.isPremium
      ? "0 */5 * * * *"
      : "0 */10 * * * *",
    execute: async (client) => {
      const { logger, dataSourceComputePriority, id, childId } =
        client.botInstanceOptions;

      const queueKey = updateChannelsQueueKey(id);
      const queue = await redis.lrange(queueKey, 0, -1);

      if (!queue.includes(childId)) {
        await redis.lpush(queueKey, childId);
      }

      while (true) {
        const [nextTurn] = await redis.lrange(queueKey, -1, -1);

        if (nextTurn === childId) {
          break;
        } else {
          await sleep(5_000);
        }
      }

      const redlock = new Redlock([redis], {
        retryCount: Infinity,
        retryDelay: 15_000,
      });

      let lock = await redlock.acquire(
        [discordAPIIntensiveOperationLockKey(id)],
        15_000,
      );

      const extendLock = async () => {
        lock = await lock.extend(15_000);
      };

      await Promise.all(
        client.guilds.cache.map(async (guild) => {
          const handledPriority = Number(
            await redis.get(advertiseEvaluatorPriorityKey(guild.id)),
          );

          if (handledPriority > dataSourceComputePriority) return;

          await updateGuildChannels(guild, extendLock).catch(
            (error: unknown) => {
              logger.error(
                `Error while trying to update channels for ${guild.toString()}`,
                { error, guild },
              );
            },
          );
        }),
      );

      await lock.release();
      await redis.rpop(queueKey);
    },
  });
};
