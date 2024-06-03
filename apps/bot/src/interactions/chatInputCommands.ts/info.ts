import { SlashCommandBuilder } from "@discordjs/builders";

import { botPermissions } from "@mc/common/botPermissions";
import { generateInviteLink } from "@mc/common/generateInviteLink";

import { env } from "~/env";
import { Command } from "~/structures";
import { BaseEmbed } from "~/utils/BaseMessageEmbed";
import { prepareLocalization } from "~/utils/prepareLocalization";

export const infoCommand = new Command({
  definition: new SlashCommandBuilder()
    .setName(prepareLocalization("interaction.commands.info.definition.name"))
    .setDescription(
      prepareLocalization("interaction.commands.info.definition.description"),
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
        }),
      )
      .setThumbnail(command.client.user.displayAvatarURL());
    await command.reply({ embeds: [embed], ephemeral: true });
  },
});
