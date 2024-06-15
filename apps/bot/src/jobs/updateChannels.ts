import type { Client, Guild } from "discord.js";
import { Redlock } from "@sesamecare-oss/redlock";
import { ChannelType } from "discord.js";

import { GuildSettings } from "@mc/common/GuildSettings";
import { redis } from "@mc/redis";

import DataSourceService from "~/DataSourceService";
import { DataSourceError } from "~/DataSourceService/DataSourceEvaluator/DataSourceError";
import { initI18n } from "~/i18n";
import { Job } from "~/structures/Job";
import botHasPermsToEdit from "~/utils/botHasPermsToEdit";
import { advertiseEvaluatorPrioritykey } from "./advertise";

async function updateGuildChannels(
  guild: Guild,
  extendLock: () => Promise<void>,
) {
  if (!guild.available) return;

  const { logger } = guild.client.botInstanceOptions;

  const guildSettings = await GuildSettings.upsert(guild.id);
  const guildChannelsSettings = await GuildSettings.channels.getAll(guild.id);
  const i18n = await initI18n(guild.preferredLocale);

  await Promise.all(
    guildChannelsSettings.map(async (channelSettings) => {
      if (!channelSettings.isTemplateEnabled) return;

      const channel = await guild.channels.fetch(
        channelSettings.discordChannelId,
      );

      if (!channel) return;
      if (!botHasPermsToEdit(channel)) {
        await GuildSettings.channels.logs
          .set(channel.id, {
            LastTemplateUpdateDate: new Date(),
            LastTemplateComputeError: new DataSourceError(
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
        i18n,
      });

      const computedTemplate = await dataSourceService
        .evaluateTemplate(channelSettings.template)
        .then((computed) => {
          GuildSettings.channels.logs
            .set(channel.id, {
              LastTemplateUpdateDate: new Date(),
              LastTemplateComputeError: null,
            })
            .catch(logger.error);

          return computed;
        })
        .catch((error) => {
          if (error instanceof Error) {
            GuildSettings.channels.logs
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
      const { logger, dataSourceComputePriority } = client.botInstanceOptions;

      const redlock = new Redlock([redis], {
        retryCount: Infinity,
        retryDelay: 15_000,
      });

      let lock = await redlock.acquire(
        [`api-intensive-operation-lock:${client.botInstanceOptions.id}`],
        15_000,
      );

      const extendLock = async () => {
        lock = await lock.extend(15_000);
      };

      await Promise.all(
        client.guilds.cache.map(async (guild) => {
          const handledPriority = Number(
            await redis.get(advertiseEvaluatorPrioritykey(guild.id)),
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
    },
  });
};
