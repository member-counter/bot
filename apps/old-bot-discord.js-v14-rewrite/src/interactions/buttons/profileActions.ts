import {
	ActionRowBuilder,
	ModalBuilder,
	TextInputBuilder
} from "@discordjs/builders";
import { ButtonInteraction, TextInputStyle } from "discord.js";

import { ButtonIds, ModalIds, TextInputIds } from "../../Constants";
// TODO: i18n
type actionButtonIds =
	typeof ButtonIds.profileActions[keyof typeof ButtonIds.profileActions];
export const profileActions = async (buttonInteraction: ButtonInteraction) => {
	const name = buttonInteraction.customId as actionButtonIds;

	if (!Object.values(ButtonIds.profileActions).includes(name)) return;
	if (!buttonInteraction.inGuild()) return;

	switch (name) {
		case "grant_credits": {
			buttonInteraction.showModal(
				new ModalBuilder()
					.setTitle("Grant Credits")
					.setCustomId(ModalIds.profileActions.grantCredits)
					.addComponents(
						new ActionRowBuilder<TextInputBuilder>().addComponents(
							new TextInputBuilder()
								.setLabel("Amount of credits to grant")
								.setCustomId(TextInputIds.profileActions.grantCredits)
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
					.setCustomId(ModalIds.profileActions.grantServerUpgrade)
					.addComponents(
						new ActionRowBuilder<TextInputBuilder>().addComponents(
							new TextInputBuilder()
								.setLabel("Amount of server upgrades to grant")
								.setCustomId(TextInputIds.profileActions.grantServerUpgrade)
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
					.setCustomId(ModalIds.profileActions.grantBadge)
					.addComponents(
						new ActionRowBuilder<TextInputBuilder>().addComponents(
							new TextInputBuilder()
								.setLabel("Badge to grant")
								.setCustomId(TextInputIds.profileActions.grantBadge)
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
					.setCustomId(ModalIds.profileActions.revokeBadge)
					.addComponents(
						new ActionRowBuilder<TextInputBuilder>().addComponents(
							new TextInputBuilder()
								.setLabel("Badge to revoke")
								.setCustomId(TextInputIds.profileActions.revokeBadge)
								.setRequired(true)
								.setStyle(TextInputStyle.Short)
						)
					)
			);
		}
	}
};
