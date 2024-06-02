import { ModalSubmitInteraction } from "discord.js";

import { emojiBadges } from "../../Constants";
import { i18nService } from "../../services/i18n";
import UserService from "../../services/UserService";

export const emojiRegex =
	/(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/gi;
export const profileModel = async (
	modalSubmitInteraction: ModalSubmitInteraction
) => {
	const userSettings = await UserService.init(
		modalSubmitInteraction.member.user.id
	);
	const { t } = await i18nService(modalSubmitInteraction);

	switch (modalSubmitInteraction.customId) {
		case "grant_credits_modal": {
			const amount = modalSubmitInteraction.fields.getTextInputValue(
				"grant_credits_amount"
			);
			await userSettings.grantCredits(parseInt(amount, 10) || 1);
			modalSubmitInteraction.reply({
				content: `Successfully granted ${amount} credits to user`,
				ephemeral: true
			});
			break;
		}
		case "grant_server_upgrade_modal": {
			const amount = modalSubmitInteraction.fields.getTextInputValue(
				"grant_server_upgrade_amount"
			);
			await userSettings.grantAvailableServerUpgrades(
				parseInt(amount, 10) || 1
			);
			modalSubmitInteraction.reply({
				content: `Successfully granted ${amount} server upgrades to user`,
				ephemeral: true
			});
			break;
		}

		case "grant_badge_modal": {
			const input = modalSubmitInteraction.fields.getTextInputValue(
				"grant_badge_input"
			) as keyof typeof emojiBadges;

			if (emojiRegex.test(input as string)) {
				const amount = emojiBadges[input];
				await userSettings.grantBadge(parseInt(amount as string, 10));
			} else {
				await userSettings.grantBadge(parseInt(input as string, 10));
			}
			modalSubmitInteraction.reply({
				content: `Successfully granted badge to user`,
				ephemeral: true
			});
			break;
		}
		case "revoke_badge_modal": {
			const input = modalSubmitInteraction.fields.getTextInputValue(
				"revoke_badge_input"
			) as keyof typeof emojiBadges;
			if (emojiRegex.test(input as string)) {
				const amount = emojiBadges[input];
				await userSettings.revokeBadge(parseInt(amount as string, 10));
			} else {
				await userSettings.revokeBadge(parseInt(input as string, 10));
			}
			modalSubmitInteraction.reply({
				content: `Successfully revoke badge to user`,
				ephemeral: true
			});
			break;
		}
		case "delete_user_profile_modal": {
			const confirmText = modalSubmitInteraction.fields.getTextInputValue(
				"delete_user_profile_confirmation_text"
			);
			if (confirmText === t("commands.profile.cancelString")) {
				modalSubmitInteraction.reply({
					content: t("commands.profile.removeDataCanceled"),
					ephemeral: true
				});
			} else if (
				confirmText === t("commands.profile.removeDataConfirmationString")
			) {
				await userSettings.remove();
				modalSubmitInteraction.reply({
					content: t("commands.profile.removeDataSuccess"),
					ephemeral: true
				});
			} else {
				modalSubmitInteraction.reply({
					content: t("commands.profile.invalidTextInputProvided", {
						CANCEL_STRING: t("commands.profile.cancelString"),
						CONFIRMATION_STRING: t(
							"commands.profile.removeDataConfirmationString"
						)
					}),
					ephemeral: true
				});
			}
		}
	}
};
