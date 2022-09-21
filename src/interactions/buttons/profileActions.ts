import {
	ActionRowBuilder,
	ModalBuilder,
	TextInputBuilder
} from "@discordjs/builders";
import { ButtonInteraction, TextInputStyle } from "discord.js";

// TODO: i18n
type actionButtonIds =
	| "grant_server_upgrade"
	| "grant_credits"
	| "grant_badge"
	| "revoke_badge";
export const profileActions = async (buttonInteraction: ButtonInteraction) => {
	const name = buttonInteraction.customId as actionButtonIds;

	if (
		![
			"grant_server_upgrade",
			"grant_credits",
			"grant_badge",
			"revoke_badge"
		].includes(name)
	)
		return;
	if (!buttonInteraction.inGuild()) return;

	switch (name) {
		case "grant_credits": {
			buttonInteraction.showModal(
				new ModalBuilder()
					.setTitle("Grant Credits")
					.setCustomId("grant_credits_modal")
					.addComponents(
						new ActionRowBuilder<TextInputBuilder>().addComponents(
							new TextInputBuilder()
								.setLabel("Amount of credits to grant")
								.setCustomId("grant_credits_amount")
								.setRequired(true)
								.setValue("1")
								.setStyle(TextInputStyle.Short)
						)
					)
			);
			break;
		}
		case "grant_server_upgrade": {
			buttonInteraction.showModal(
				new ModalBuilder()
					.setTitle("Grant Server Upgrade")
					.setCustomId("grant_server_upgrade_modal")
					.addComponents(
						new ActionRowBuilder<TextInputBuilder>().addComponents(
							new TextInputBuilder()
								.setLabel("Amount of server upgrades to grant")
								.setCustomId("grant_server_upgrade_amount")
								.setRequired(true)
								.setValue("1")
								.setStyle(TextInputStyle.Short)
						)
					)
			);
			break;
		}
		case "grant_badge": {
			buttonInteraction.showModal(
				new ModalBuilder()
					.setTitle("Grant Badge")
					.setCustomId("grant_badge_modal")
					.addComponents(
						new ActionRowBuilder<TextInputBuilder>().addComponents(
							new TextInputBuilder()
								.setLabel("Badge to grant")
								.setCustomId("grant_badge_input")
								.setRequired(true)
								.setStyle(TextInputStyle.Short)
						)
					)
			);
			break;
		}
		case "revoke_badge": {
			buttonInteraction.showModal(
				new ModalBuilder()
					.setTitle("Revoke badge")
					.setCustomId("revoke_badge_modal")
					.addComponents(
						new ActionRowBuilder<TextInputBuilder>().addComponents(
							new TextInputBuilder()
								.setLabel("Badge to revoke")
								.setCustomId("revoke_badge_input")
								.setRequired(true)
								.setStyle(TextInputStyle.Short)
						)
					)
			);
		}
	}
};
