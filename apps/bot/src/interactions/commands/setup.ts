import type { DataSource } from "@mc/common/DataSource";
import type { Channel } from "discord.js";
import {
  chatInputApplicationCommandMention,
  SlashCommandBuilder,
} from "@discordjs/builders";
import {
  CategoryChannel,
  ChannelType,
  OverwriteType,
  PermissionFlagsBits,
  PermissionsBitField,
} from "discord.js";

import {
  DataSourceId,
  MembersFilterStatus,
  stringifyDataSoure,
  TwitchDataSourceReturn,
  YouTubeDataSourceReturn,
} from "@mc/common/DataSource";
import { GuildSettings } from "@mc/common/GuildSettings";
import { noop } from "@mc/common/noop";
import logger from "@mc/logger";

import DataSourceService from "~/DataSourceService";
import { DEFAULT_LANGUAGE, initI18n, tKey } from "~/i18n";
import { Command } from "~/structures";
import { fetchCommandId } from "~/utils/fetchCommandId";
import { prepareLocalization } from "~/utils/prepareLocalization";

enum TemplateStatus {
  PENDING,
  READY,
  FAILED,
}

const TemplateStatusEmojis: Record<TemplateStatus, string> = {
  [TemplateStatus.PENDING]: "💭",
  [TemplateStatus.READY]: "☑️",
  [TemplateStatus.FAILED]: "❌",
} as const;

const CategoryStatusTKey = {
  [TemplateStatus.PENDING]: "creatingCategory",
  [TemplateStatus.READY]: "createdCategory",
  [TemplateStatus.FAILED]: "failedCategory",
} as const;

const CounterStatusTKey = {
  [TemplateStatus.PENDING]: "creatingChannel",
  [TemplateStatus.READY]: "createdChannel",
  [TemplateStatus.FAILED]: "failedChannel",
} as const;

export const setupCommand = new Command({
  slashDefinition: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false)
    .setName(
      prepareLocalization("interaction.commands.setup.definition.slash.name"),
    )
    .setDescription(
      prepareLocalization(
        "interaction.commands.setup.definition.slash.description",
      ),
    )
    .addSubcommand((subCommand) =>
      subCommand
        .setName(
          prepareLocalization(
            "interaction.commands.setup.definition.slash.subcommands.server.name",
          ),
        )
        .setDescription(
          prepareLocalization(
            "interaction.commands.setup.definition.slash.subcommands.server.description",
          ),
        ),
    )
    .addSubcommand((subCommand) =>
      subCommand
        .setName(
          prepareLocalization(
            "interaction.commands.setup.definition.slash.subcommands.twitch.name",
          ),
        )
        .setDescription(
          prepareLocalization(
            "interaction.commands.setup.definition.slash.subcommands.twitch.description",
          ),
        )
        .addStringOption((option) =>
          option
            .setName(
              prepareLocalization(
                "interaction.commands.setup.definition.slash.subcommands.twitch.options.username.name",
              ),
            )
            .setDescription(
              prepareLocalization(
                "interaction.commands.setup.definition.slash.subcommands.twitch.options.username.description",
              ),
            )
            .setRequired(true),
        ),
    )
    .addSubcommand((subCommand) =>
      subCommand
        .setName(
          prepareLocalization(
            "interaction.commands.setup.definition.slash.subcommands.x-twitter.name",
          ),
        )
        .setDescription(
          prepareLocalization(
            "interaction.commands.setup.definition.slash.subcommands.x-twitter.description",
          ),
        )
        .addStringOption((option) =>
          option
            .setName(
              prepareLocalization(
                "interaction.commands.setup.definition.slash.subcommands.x-twitter.options.username.name",
              ),
            )
            .setDescription(
              prepareLocalization(
                "interaction.commands.setup.definition.slash.subcommands.x-twitter.options.username.description",
              ),
            )
            .setRequired(true),
        ),
    )
    .addSubcommand((subCommand) =>
      subCommand
        .setName(
          prepareLocalization(
            "interaction.commands.setup.definition.slash.subcommands.youtube.name",
          ),
        )
        .setDescription(
          prepareLocalization(
            "interaction.commands.setup.definition.slash.subcommands.youtube.description",
          ),
        )
        .addStringOption((option) =>
          option
            .setName(
              prepareLocalization(
                "interaction.commands.setup.definition.slash.subcommands.youtube.options.channelUrl.name",
              ),
            )
            .setDescription(
              prepareLocalization(
                "interaction.commands.setup.definition.slash.subcommands.youtube.options.channelUrl.description",
              ),
            )
            .setRequired(true),
        ),
    ),
  handle: async (command, i18n) => {
    if (!command.inGuild() || !command.isChatInputCommand()) throw null;

    const { t } = i18n;
    const i18nDefault = await initI18n(DEFAULT_LANGUAGE);
    const type = command.options.getSubcommand(true);
    const templates = t(`interaction.commands.setup.templates`, {
      returnObjects: true,
    });

    function assertValidType(
      type: string,
    ): asserts type is keyof typeof templates {
      if (!Object.keys(templates).includes(type))
        throw Error("Type is missing on translation files");
    }

    assertValidType(type);

    const requestedTemplate = templates[type];

    let categoryStatus: TemplateStatus = TemplateStatus.PENDING;
    const channelsStatus = new Array<TemplateStatus>(
      requestedTemplate.counters.length,
    ).fill(TemplateStatus.PENDING);

    async function updateStatusMessage() {
      const isEverythingReady =
        categoryStatus !== TemplateStatus.PENDING &&
        channelsStatus.every((counter) => counter !== TemplateStatus.PENDING);

      // General status
      let content: string = t(
        `interaction.commands.setup.status.${isEverythingReady ? "completed" : "creating"}`,
      );
      content += "\n\n";

      // Category status
      content += t(
        `interaction.commands.setup.status.${CategoryStatusTKey[categoryStatus]}`,
        {
          ICON: TemplateStatusEmojis[categoryStatus],
        },
      );
      content += "\n";

      // Counters status
      channelsStatus.forEach((counterStatus, index) => {
        content += t(
          `interaction.commands.setup.status.${CounterStatusTKey[counterStatus]}`,
          {
            ICON: TemplateStatusEmojis[counterStatus],
            NAME: requestedTemplate.counters[index]?.name,
          },
        );
        content += "\n";
      });

      content += "\n";

      const configureCommandNameTKey = tKey(
        "interaction.commands.configure.definition.slash.name",
      );
      const configureCommandMention = chatInputApplicationCommandMention(
        t(configureCommandNameTKey),
        await fetchCommandId(command.client, configureCommandNameTKey),
      );

      content += t("interaction.commands.setup.status.configureSuggestion", {
        CONFIGURE_COMMAND: configureCommandMention,
      });

      await command.editReply({ content });
    }

    async function createChannel(template: string, parent?: Channel) {
      const type = parent ? ChannelType.GuildVoice : ChannelType.GuildCategory;
      const dataSourceService = new DataSourceService({
        i18n,
        guildSettings,
        channelType: type,
      });

      const name = await dataSourceService.evaluateTemplate(template);

      const channel = await guild.channels.create({
        parent: parent instanceof CategoryChannel ? parent : undefined,
        type,
        name,
        permissionOverwrites: [
          {
            id: command.client.user.id,
            type: OverwriteType.Member,
            allow: new PermissionsBitField().add([
              PermissionFlagsBits.Connect,
              PermissionFlagsBits.ViewChannel,
            ]),
          },
          {
            id: guild.id,
            type: OverwriteType.Role,
            deny: new PermissionsBitField().add([PermissionFlagsBits.Connect]),
          },
        ],
      });

      await GuildSettings.channels.update({
        discordChannelId: channel.id,
        discordGuildId: channel.guildId,
        isTemplateEnabled: true,
        template: template,
      });

      GuildSettings.channels.logs
        .set(channel.id, {
          LastTemplateComputeDate: new Date(),
        })
        .catch(noop);

      return channel;
    }

    function configureTemplate() {
      if (!command.inGuild() || !command.isChatInputCommand()) throw null;

      assertValidType(type);
      const template = structuredClone(requestedTemplate);

      switch (type) {
        case "youtube": {
          const channelUrl = command.options.getString(
            i18nDefault.t(
              "interaction.commands.setup.definition.slash.subcommands.youtube.options.channelUrl.name",
            ),
            true,
          );
          const youtubeNameDataSource = {
            id: DataSourceId.YOUTUBE,
            options: {
              channelUrl,
              return: YouTubeDataSourceReturn.CHANNEL_NAME,
            },
          };

          const youtubeSubscribersDataSource = structuredClone(
            youtubeNameDataSource,
          );
          youtubeSubscribersDataSource.options.return =
            YouTubeDataSourceReturn.SUBSCRIBERS;

          const youtubeViewsDataSource = structuredClone(youtubeNameDataSource);
          youtubeViewsDataSource.options.return = YouTubeDataSourceReturn.VIEWS;

          const youtubeVideosDataSource = structuredClone(
            youtubeNameDataSource,
          );
          youtubeVideosDataSource.options.return =
            YouTubeDataSourceReturn.VIDEOS;

          template.categoryName = t(
            `interaction.commands.setup.templates.${type}.categoryName`,
            { COUNTER: stringifyDataSoure(youtubeNameDataSource) },
          );

          [
            youtubeSubscribersDataSource,
            youtubeVideosDataSource,
            youtubeViewsDataSource,
          ].forEach((dataSource, i) => {
            const counter = template.counters[i];
            if (!counter) return;
            counter.template = t(
              `interaction.commands.setup.templates.${type}.counters.${i as 0 | 1 | 2}.template`,
              { COUNTER: stringifyDataSoure(dataSource) },
            );
          });

          break;
        }

        case "twitch": {
          const username = command.options.getString(
            i18nDefault.t(
              "interaction.commands.setup.definition.slash.subcommands.twitch.options.username.name",
            ),
            true,
          );

          const twitchNameDataSource = {
            id: DataSourceId.TWITCH,
            options: {
              username,
              return: TwitchDataSourceReturn.CHANNEL_NAME,
            },
          };

          const twitchFollowersDataSource =
            structuredClone(twitchNameDataSource);
          twitchFollowersDataSource.options.return =
            TwitchDataSourceReturn.FOLLOWERS;

          const twitchViewsDataSource = structuredClone(twitchNameDataSource);
          twitchViewsDataSource.options.return = TwitchDataSourceReturn.VIEWS;

          template.categoryName = t(
            `interaction.commands.setup.templates.${type}.categoryName`,
            { COUNTER: stringifyDataSoure(twitchNameDataSource) },
          );

          [twitchFollowersDataSource, twitchViewsDataSource].forEach(
            (dataSource, i) => {
              const counter = template.counters[i];
              if (!counter) return;
              counter.template = t(
                `interaction.commands.setup.templates.${type}.counters.${i as 0 | 1}.template`,
                { COUNTER: stringifyDataSoure(dataSource) },
              );
            },
          );

          break;
        }

        case "x-twitter": {
          const username = command.options.getString(
            i18nDefault.t(
              "interaction.commands.setup.definition.slash.subcommands.x-twitter.options.username.name",
            ),
            true,
          );

          const twitterFollowersDataSource = {
            id: DataSourceId.TWITTER,
            options: {
              username,
            },
          };

          template.categoryName = t(
            `interaction.commands.setup.templates.${type}.categoryName`,
            { COUNTER: username },
          );

          template.counters[0].template = t(
            `interaction.commands.setup.templates.${type}.counters.${0}.template`,
            { COUNTER: stringifyDataSoure(twitterFollowersDataSource) },
          );

          break;
        }

        case "server": {
          (
            [
              {
                id: DataSourceId.MEMBERS,
                options: {
                  statusFilter: MembersFilterStatus.ONLINE,
                },
              },
              {
                id: DataSourceId.MEMBERS,
              },
              {
                id: DataSourceId.NITRO_BOOSTERS,
              },
              {
                id: DataSourceId.ROLES,
              },
              {
                id: DataSourceId.CHANNELS,
              },
            ] satisfies DataSource[]
          ).forEach((dataSource, i) => {
            const counter = template.counters[i];
            if (!counter) return;
            counter.template = t(
              `interaction.commands.setup.templates.${type}.counters.${i as 0 | 1 | 2}.template`,
              { COUNTER: stringifyDataSoure(dataSource) },
            );
          });

          break;
        }
      }

      return template;
    }

    const guild = await command.client.guilds.fetch(command.guildId);
    const guildSettings = await GuildSettings.upsert(command.guildId);
    const configuredTemplate = configureTemplate();
    await updateStatusMessage();

    const categoryChannel = await createChannel(configuredTemplate.categoryName)
      .then(async (channel) => {
        categoryStatus = TemplateStatus.READY;
        await updateStatusMessage();
        return channel;
      })
      .catch(async (error) => {
        logger.error(error);
        categoryStatus = TemplateStatus.FAILED;
        channelsStatus.forEach(
          (_, i) => (channelsStatus[i] = TemplateStatus.FAILED),
        );
        await updateStatusMessage();
        throw error;
      });

    await Promise.all(
      configuredTemplate.counters.map(async (counter, i) => {
        await createChannel(counter.template, categoryChannel)
          .then(() => {
            categoryStatus = TemplateStatus.READY;
          })
          .catch((error) => {
            logger.error(error);
            channelsStatus[i] = TemplateStatus.FAILED;
          })
          .then(updateStatusMessage);
      }),
    );
  },
});
