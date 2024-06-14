import type { Guild, Snowflake } from "discord.js";
import { ChannelType } from "discord.js";

import { GuildSettings } from "@mc/common/GuildSettings";

import DataSourceService from "~/DataSourceService";
import { DataSourceError } from "~/DataSourceService/DataSourceEvaluator/DataSourceError";
import { initI18n } from "~/i18n";
import { Job } from "~/structures/Job";
import botHasPermsToEdit from "~/utils/botHasPermsToEdit";

async function updateGuildChannels(guild: Guild) {
  if (!guild.available) return;

  // TODO handle bot priority

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
    }),
  );
}

const guildsBeingUpdated = new Set<Snowflake>();

export const updateChannels = new Job({
  name: "Update channels",
  time: "0 */5 * * * *",
  execute: async (client) => {
    const { logger } = client.botInstanceOptions;

    client.guilds.cache.forEach((guild) => {
      if (guildsBeingUpdated.has(guild.id)) return;
      guildsBeingUpdated.add(guild.id);

      updateGuildChannels(guild)
        .catch((error: unknown) => {
          logger.error(
            `Error while trying to update channels for ${guild.toString()}`,
            { error, guild },
          );
        })
        .finally(() => {
          guildsBeingUpdated.delete(guild.id);
        });
    });

    return Promise.resolve();
  },
});
