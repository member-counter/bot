import { SlashCommandBuilder } from "@discordjs/builders";
import config from "../../config";

import { Command } from "../../structures";
import { BaseMessageEmbed, getBotInviteLink } from "../../utils";

export const infoCommand = new Command<"info">({
	name: "info",
	definition: new SlashCommandBuilder()
		.setName("info")
		.setDescription("untranslated")
		.setDMPermission(true),
	execute: async (command, { t }) => {
		const {
			discord: {
				supportServer: { url },
				bot: { websiteUrl }
			},
			premium: { getPremiumBotUrl }
		} = config;
		const embed = new BaseMessageEmbed()
			.setDescription(
				t("commands.info.embedReply.description", {
					BOT_INVITE_URL: getBotInviteLink(),
					BOT_SERVER_URL: url,
					WEBSITE: websiteUrl,
					GET_PREMIUM_BOT_URL: getPremiumBotUrl
				})
			)
			.setThumbnail(command.client.user.displayAvatarURL());
		command.reply({ embeds: [embed], ephemeral: true });
	},
	// TODO: add needed intents and permissions
	neededPermissions: [],
	neededIntents: []
});
