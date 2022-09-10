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
				const { txt: translate } = await i18n(interaction);
				const embed = new BaseMessageEmbed();
				const id = uuid();

				let title: string, description: string, footer: string;

				try {
					title = await translate("INTERACTION_COMMAND_HANDLER_ERROR_TITLE");
					description = await translate(
						"INTERACTION_COMMAND_HANDLER_ERROR_DESCRIPTION"
					);
					footer = await translate("INTERACTION_COMMAND_HANDLER_ERROR_FOOTER");
				} catch (e) {
					logger.error(e);
				}

				// If we can't get translations because our provider is redis and it is probably down, let's use these hardcoded ones
				title ??= "ERROR!";
				description ??=
					"Something went wrong, please, try again later\n\nSupport server: {SUPPORT_SERVER_INVITE}";
				footer ??= `Error ID: {ERROR_ID}`;

				embed.setColor(Colors.RED);
				embed.setTitle(title);

				if (error instanceof UserError) {
					embed.setDescription(
						await translate(error.message, error.placeholderData).catch(
							() => "Translation service not available"
						)
					);
				} else {
					embed.setDescription(
						description.replaceAll(
							"{SUPPORT_SERVER_INVITE}",
							config.discord.supportServer.url
						)
					);
				}

				embed.setFooter({ text: footer.replaceAll("{ERROR_ID}", id) });
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
