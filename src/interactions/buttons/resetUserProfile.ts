import {
	ActionRowBuilder,
	ModalBuilder,
	TextInputBuilder
} from "@discordjs/builders";
import { ButtonInteraction, TextInputStyle } from "discord.js";

import { i18nService } from "../../services/i18n";

export const buttonId = "delete_user_profile";

export const resetUserProfile = async (
	buttonInteraction: ButtonInteraction
) => {
	const name = buttonInteraction.customId;

	if (name !== buttonId) return;
	if (!buttonInteraction.inGuild()) return;
	const { t } = await i18nService(buttonInteraction);

	buttonInteraction.showModal(
		new ModalBuilder()
			.setTitle("Confirm data deletion")
			.setCustomId("delete_user_profile_modal")
			.addComponents(
				new ActionRowBuilder<TextInputBuilder>().addComponents(
					new TextInputBuilder()
						.setLabel("Type confirmation text below")
						.setCustomId("delete_user_profile_confirmation_text")
						.setRequired(true)
						.setPlaceholder(t("commands.profile.removeDataConfirmationString"))
						.setStyle(TextInputStyle.Short)
				)
			)
	);
};
