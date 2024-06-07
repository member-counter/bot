import {
  ActionRowBuilder,
  ButtonBuilder,
  chatInputApplicationCommandMention,
  SlashCommandBuilder,
} from "@discordjs/builders";
import { ButtonStyle, PermissionFlagsBits } from "discord.js";

import { Routes } from "@mc/common/Routes";

import { env } from "~/env";
import { tKey } from "~/i18n";
import { Command } from "~/structures";
import { fetchCommandId } from "~/utils/fetchCommandId";
import { prepareLocalization } from "~/utils/prepareLocalization";

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
    if (!command.inGuild() || !command.isChatInputCommand()) throw null;

    const setupCommandNameTKey = tKey(
      "interaction.commands.setup.definition.slash.name",
    );
    const setupSubCommandNameTKey = tKey(
      "interaction.commands.setup.definition.slash.subcommands.server.name",
    );
    const setupCommandMention = chatInputApplicationCommandMention(
      t(setupCommandNameTKey),
      t(setupSubCommandNameTKey),
      await fetchCommandId(command.client, setupCommandNameTKey),
    );

    console.log(setupCommandMention);
    console.log(1);

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
