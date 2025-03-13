import {
  ActionRowBuilder,
  ButtonBuilder,
  chatInputApplicationCommandMention,
  SlashCommandBuilder,
} from "@discordjs/builders";
import { ButtonStyle, PermissionFlagsBits } from "discord.js";

import { fetchCommandId } from "@mc/common/bot/fetchCommandId";
import { tKey } from "@mc/common/bot/i18n/index";
import { prepareLocalization } from "@mc/common/bot/i18n/prepareLocalization";
import { Command } from "@mc/common/bot/structures/Command";
import { Routes } from "@mc/common/Routes";

import { env } from "~/env";
import { DEFAULT_LANGUAGE, initI18n } from "~/i18n";

export const configureCommand = new Command({
  slashDefinition: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false)
    .setName(
      prepareLocalization(
        "interaction.commands.configure.definition.slash.name",
      ),
    )
    .setDescription(
      prepareLocalization(
        "interaction.commands.configure.definition.slash.description",
      ),
    ),
  handle: async (command, { t }) => {
    if (!command.inGuild() || !command.isChatInputCommand())
      throw new Error("Unhandlable command", { cause: command });

    const setupCommandNameTKey = tKey(
      "interaction.commands.setup.definition.slash.name",
    );
    const setupSubCommandNameTKey = tKey(
      "interaction.commands.setup.definition.slash.subcommands.server.name",
    );
    const setupCommandMention = chatInputApplicationCommandMention(
      t(setupCommandNameTKey),
      t(setupSubCommandNameTKey),
      await fetchCommandId({
        client: command.client,
        tkey: setupCommandNameTKey,
        defaultLanguage: DEFAULT_LANGUAGE,
        initI18n: initI18n,
      }),
    );

    await command.editReply({
      content: t("interaction.commands.configure.reply", {
        SETUP_COMMAND: setupCommandMention,
      }),
      components: [
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setLabel(t("interaction.commands.configure.dashboardButton"))
            .setStyle(ButtonStyle.Link)
            .setURL(Routes(env.WEBSITE_URL).DashboardServers(command.guildId)),
        ),
      ],
    });
  },
});
