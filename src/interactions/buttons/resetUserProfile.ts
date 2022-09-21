import { ActionRowBuilder, ButtonBuilder } from "@discordjs/builders";
import { ButtonInteraction, ButtonStyle } from "discord.js";

import UserService from "../../services/UserService";
import { i18nService } from "../../services/i18n";

export const buttonId = "delete_user_profile";

export const resetUserProfile = async (
	buttonInteraction: ButtonInteraction
) => {
	const [name, confirm] = buttonInteraction.customId
		.split(":")
		.map((el, index) => {
			if (index == 1) return JSON.parse(el);
			else return el;
		}) as [string, boolean];

	if (name !== buttonId) return;
	if (!buttonInteraction.inGuild()) return;

	const { t } = await i18nService(buttonInteraction);

	if (confirm) {
		const userService = await UserService.init(
			buttonInteraction.member.user.id
		);
		await userService.remove();

		await buttonInteraction.reply({
			content: t("commands.profile.removeDataSuccess")
		});
	} else if (confirm === false) {
		await buttonInteraction.reply({
			content: t("commands.profile.removeDataCanceled"),
			components: []
		});
	} else {
		const componentRow = new ActionRowBuilder<ButtonBuilder>();

		componentRow.addComponents(
			new ButtonBuilder({
				style: ButtonStyle.Danger,
				label: t("commands.profile.buttons.confirmDataDeletion.label"),
				custom_id: `${buttonId}:true`,
				emoji: { name: "🗑" }
			}),
			new ButtonBuilder({
				style: ButtonStyle.Primary,
				label: t("commands.profile.buttons.cancelDataDeletion.label"),
				custom_id: `${buttonId}:false`,
				emoji: { name: "❌" }
			})
		);

		await buttonInteraction.reply({
			components: [componentRow],
			content: t("commands.profile.removeDataConfirmation", {
				DELETE_DATA: t("commands.profile.buttons.confirmDataDeletion.label"),
				CANCEL_DELETION: t("commands.profile.buttons.cancelDataDeletion.label")
			})
		});
	}
};
