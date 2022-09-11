import { inlineCode } from "discord.js";
import { v4 as uuid } from "uuid";

import config from "../config";
import { Colors } from "../Constants";
import handleAutocomplete from "../interactions/autocompletes";
import handleButton from "../interactions/buttons";
import handleCommand from "../interactions/commands";
import logger from "../logger";
import { i18n } from "../services/i18n";
import { Event } from "../structures";
import BaseMessageEmbed from "../utils/BaseMessageEmbed";
import { UserError } from "../utils/UserError";

export const interactionCreateEvent = new Event({
	name: "interactionCreate",
	handler: async (interaction) => {
		try {
			if (interaction.isCommand()) {
				await handleCommand(interaction);
			} else if (interaction.isAutocomplete()) {
				await handleAutocomplete(interaction);
			} else if (interaction.isButton()) {
				await handleButton(interaction);
			}
		} catch (error) {
			if (interaction.isCommand() || interaction.isMessageComponent()) {
				const embed = new BaseMessageEmbed();
				const id = uuid();

				let title: string, description: string;

				try {
					const { t } = await i18n(interaction);
					title = t("interaction.commandHandler.error.title");
					description = t("interaction.commandHandler.error.description");
				} catch (e) {
					logger.error(e);
				}

				// If we can't get translations because our provider is redis and it is probably down, let's use these hardcoded ones
				title ??= "ERROR!";
				description ??=
					"Something went wrong, please, try again later\n\nSupport server: {{SUPPORT_SERVER_INVITE}}\n\nError ID: {{ERROR_ID}}";

				embed.setColor(Colors.RED);
				embed.setTitle(title);

				if (error instanceof UserError) {
					embed.setDescription(error.message);
				} else {
					embed.setDescription(
						description
							.replaceAll(
								"{{SUPPORT_SERVER_INVITE}}",
								config.discord.supportServer.url
							)
							.replaceAll("{{ERROR_ID}}", inlineCode(id))
					);
				}

				logger.error(`Interaction error ${id}:`, error);
				interaction
					.reply({ embeds: [embed], ephemeral: true })
					.catch((error) => {
						logger.error("Interaction error reply error:", error);
					});
			} else {
				logger.error(
					"Something went wrong while processing the interaction: " + error
				);
			}
		}
	}
});
