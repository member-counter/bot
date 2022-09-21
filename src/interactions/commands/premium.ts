import { SlashCommandBuilder } from "@discordjs/builders";

import config from "../../config";
import { Command } from "../../structures";
import { BaseMessageEmbed } from "../../utils";

export const premiumCommand = new Command({
	definition: new SlashCommandBuilder()
		.setName("premium")
		.setDescription("untranslated"),
	execute: async (command, { t }) => {
		const embed = new BaseMessageEmbed({
			...t("commands.premium.embedReply", { returnObjects: true }),
			description: t("commands.premium.embedReply.description", {
				GET_PREMIUM_BOT_URL: config.premium.getPremiumBotUrl
			})
		});
		command.reply({ embeds: [embed], ephemeral: true });
	},
	// TODO: set the right intents and permissions
	neededIntents: [],
	neededPermissions: ["EmbedLinks"]
});
