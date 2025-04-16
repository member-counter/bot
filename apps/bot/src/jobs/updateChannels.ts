import type { Client, Guild } from "discord.js";
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
import { makeIsValidChild } from "~/utils/isValidChildId";
import { withQueueLock } from "~/utils/withQueueLock";

async function updateGuildChannels(
  guild: Guild,
  extendLock: () => Promise<unknown>,
) {
  if (!guild.available) return;

  const { logger } = guild.client.botInstanceOptions;

  const guildSettings = await GuildSettingsService.upsert(guild.id);
  const guildChannelsSettings = await GuildSettingsService.channels.getAll(
    guild.id,
  );
  const i18n = await initI18n({ locale: guild.preferredLocale });

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
      const lockKey = discordAPIIntensiveOperationLockKey(id);

      await withQueueLock({
        queueKey,
        lockKey,
        queueEntryId: childId,
        isValidEntry: makeIsValidChild(client.botInstanceOptions),
        task: async (extendLock) => {
          await Promise.all(
            client.guilds.cache.map(async (guild) => {
              const handledPriority = Number(
                await redis.get(advertiseEvaluatorPriorityKey(guild.id)),
              );

              if (handledPriority > dataSourceComputePriority) return;

              await updateGuildChannels(guild, () => extendLock(15_000)).catch(
                (error: unknown) => {
                  logger.error(
                    `Error while trying to update channels for ${guild.toString()}`,
                    { error, guild },
                  );
                },
              );
            }),
          );
        },
      });
    },
  });
};
