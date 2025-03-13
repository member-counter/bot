import {
  ActionRowBuilder,
  ButtonBuilder,
  SlashCommandBuilder,
} from "@discordjs/builders";
import { ButtonStyle } from "discord.js";

import { botPermissions } from "@mc/common/bot/botPermissions";
import { prepareLocalization } from "@mc/common/bot/i18n/prepareLocalization";
import { Command } from "@mc/common/bot/structures/Command";
import { generateInviteLink } from "@mc/common/generateInviteLink";

import { env } from "~/env";
import { BaseEmbed } from "~/utils/BaseMessageEmbed";

export const inviteCommand = new Command({
  slashDefinition: new SlashCommandBuilder()
    .setName(
      prepareLocalization("interaction.commands.invite.definition.slash.name"),
    )
    .setDescription(
      prepareLocalization(
        "main:interaction.commands.invite.definition.slash.description",
      ),
    )
    .setDMPermission(true),
  handle: async (command, { t }) => {
    const embed = new BaseEmbed(command.client);

    embed.setDescription(
      t("interaction.commands.invite.description", {
        INVITE_URL: generateInviteLink({
          clientId: env.MAIN_DISCORD_CLIENT_ID,
          permissions: botPermissions,
        }),
      }),
    );

    const componentRow = new ActionRowBuilder<ButtonBuilder>();
    componentRow.addComponents(
      new ButtonBuilder({
        style: ButtonStyle.Link,
        url: generateInviteLink({
          clientId: env.MAIN_DISCORD_CLIENT_ID,
          permissions: botPermissions,
        }),
        label: t("interaction.commands.invite.addToServer"),
      }),
    );

    if (command.inGuild() && command.memberPermissions.has("ManageGuild")) {
      componentRow.addComponents(
        new ButtonBuilder({
          style: ButtonStyle.Link,
          url: generateInviteLink({
            clientId: env.MAIN_DISCORD_CLIENT_ID,
            permissions: botPermissions,
            selectedGuild: command.guildId,
          }),
          label: t("interaction.commands.invite.addToServerAgain"),
        }),
      );
    }

    componentRow.addComponents(
      new ButtonBuilder({
        style: ButtonStyle.Link,
        url: env.NEXT_PUBLIC_SUPPORT_URL,
        label: t("interaction.commands.invite.joinSupportServer"),
      }),
    );

    await command.editReply({
      embeds: [embed],
      components: [componentRow],
    });
  },
});
