import {
	ActionRowBuilder,
	ModalBuilder,
	TextInputBuilder
} from "@discordjs/builders";
import { ButtonInteraction, TextInputStyle } from "discord.js";
import { ButtonIds, ModalIds, TextInputIds } from "../../Constants";

import { i18nService } from "../../services/i18n";

export const deleteUserProfile = async (
	buttonInteraction: ButtonInteraction
) => {
	const name = buttonInteraction.customId;

	if (name !== ButtonIds.deleteUserProfile) return;
	if (!buttonInteraction.inGuild()) return;
	const { t } = await i18nService(buttonInteraction);

	buttonInteraction.showModal(
		new ModalBuilder()
			.setTitle("Confirm data deletion")
			.setCustomId(ModalIds.deleteUserProfile)
			.addComponents(
				new ActionRowBuilder<TextInputBuilder>().addComponents(
					new TextInputBuilder()
						.setLabel("Type confirmation text below")
						.setCustomId(TextInputIds.deleteUserProfile)
						.setRequired(true)
						.setPlaceholder(t("commands.profile.removeDataConfirmationString"))
						.setStyle(TextInputStyle.Short)
				)
			)
	);
};
