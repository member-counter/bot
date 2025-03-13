import { inlineCode, SlashCommandBuilder } from "@discordjs/builders";

import { botPermissions } from "@mc/common/bot/botPermissions";
import { prepareLocalization } from "@mc/common/bot/i18n/prepareLocalization";
import { Command } from "@mc/common/bot/structures/Command";
import { generateInviteLink } from "@mc/common/generateInviteLink";

import { version } from "~/../../../../package.json";
import { env } from "~/env";
import { BaseEmbed } from "~/utils/BaseMessageEmbed";

export const infoCommand = new Command({
  slashDefinition: new SlashCommandBuilder()
    .setName(
      prepareLocalization("interaction.commands.info.definition.slash.name"),
    )
    .setDescription(
      prepareLocalization(
        "interaction.commands.info.definition.slash.description",
      ),
    )
    .setDMPermission(true),
  handle: async (command, { t }) => {
    const embed = new BaseEmbed(command.client)
      .setDescription(
        t("interaction.commands.info.embedReply.description", {
          BOT_INVITE_URL: generateInviteLink({
            clientId: command.client.user.id,
            permissions: botPermissions,
          }),
          BOT_REPO_URL: env.NEXT_PUBLIC_BOT_REPO_URL,
          BOT_SUPPORT_URL: env.NEXT_PUBLIC_SUPPORT_URL,
          WEBSITE_URL: env.WEBSITE_URL,
          VERSION: inlineCode("v" + version),
          VERSION_URL: `${env.NEXT_PUBLIC_BOT_REPO_URL}/releases/tag/v${version}`,
        }),
      )
      .setThumbnail(command.client.user.displayAvatarURL());
    await command.editReply({ embeds: [embed] });
  },
});
