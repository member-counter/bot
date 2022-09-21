import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	inlineCode,
	InteractionType
} from "discord.js";
import { v4 as uuid } from "uuid";
import { i18n } from "i18next";
import config from "../config";
import { Colors } from "../Constants";
import handleModalSubmit from "../interactions/modals";
import handleAutocomplete from "../interactions/autocompletes";
import handleButton from "../interactions/buttons";
import handleCommand from "../interactions/commands";
import logger from "../logger";
import { i18nService } from "../services/i18n";
import { Event } from "../structures";
import { BaseMessageEmbed, UserError } from "../utils";

export const interactionCreateEvent = new Event({
	name: "interactionCreate",
	handler: async (interaction) => {
		if (
			config.ghostMode &&
			!config.botOwners.includes(interaction.member.user.id)
		)
			return;
		try {
			switch (interaction.type) {
				case InteractionType.ApplicationCommand: {
					await handleCommand(interaction);
					break;
				}
				case InteractionType.ApplicationCommandAutocomplete: {
					await handleAutocomplete(interaction);
					break;
				}
				case InteractionType.MessageComponent: {
					if (interaction.isButton()) {
						await handleButton(interaction);
					} else {
						// TODO: Handle select menu
					}
					break;
				}
				case InteractionType.ModalSubmit: {
					await handleModalSubmit(interaction);
					break;
				}
			}
		} catch (error) {
			if (interaction.isCommand() || interaction.isMessageComponent()) {
				const embed = new BaseMessageEmbed();
				const id = uuid();
				let i18n: i18n;
				let title: string, description: string, supportServerBtn: string;

				try {
					i18n = await i18nService(interaction);
					title = i18n.t("interaction.commandHandler.error.title");
					description = i18n.t("interaction.commandHandler.error.description");
					supportServerBtn = i18n.t("commands.invite.joinSupportServer");
				} catch (e) {
					logger.error(e);
				}

				// If we can't get translations because our provider is redis and it is probably down, let's use these hardcoded ones
				title ??= "ERROR!";
				description ??=
					"Something went wrong, please, try again later\n\nError ID: {{ERROR_ID}}";
				supportServerBtn ??= "Join support server";

				if (error instanceof UserError && i18n) {
					embed.setDescription(i18n.t(error.message));
				} else {
					embed.setDescription(
						description.replaceAll("{{ERROR_ID}}", inlineCode(id))
					);
				}

				logger.error(
					`Interaction error ${id}:`,
					interaction,
					error?.message,
					error?.stack
				);
				// eslint-disable-next-line no-console
				console.error(error);

				embed.setColor(Colors.RED);
				embed.setTitle(title);

				const componentRow = new ActionRowBuilder<ButtonBuilder>();
				componentRow.addComponents(
					new ButtonBuilder({
						style: ButtonStyle.Link,
						url: config.discord.supportServer.url,
						label: supportServerBtn
					})
				);

				interaction
					.reply({
						embeds: [embed],
						components: [componentRow],
						ephemeral: true
					})
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
