import type { ModalSubmitInteraction } from "discord.js";

import { UserSettings } from "@mc/common/UserSettings";

import { InteractionId } from "~/Constants";
import { initI18n } from "~/i18n";

export const deleteUserProfileModal = async (
  modalSubmitInteraction: ModalSubmitInteraction,
) => {
  if (
    modalSubmitInteraction.customId !==
    InteractionId.Profile.DeleteUserProfile.Modal
  )
    return;

  const userSettings = await UserSettings.upsert(
    modalSubmitInteraction.user.id,
  );

  const { t } = await initI18n(modalSubmitInteraction);

  const confirmText = modalSubmitInteraction.fields.getTextInputValue(
    InteractionId.Profile.DeleteUserProfile.ModalConfirmationText,
  );
  const validConfirmText = t(
    "interaction.commands.profile.deleteProfileModal.removeDataConfirmationString",
  );

  if (confirmText !== validConfirmText) {
    await modalSubmitInteraction.reply({
      content: t(
        "interaction.commands.profile.deleteProfileModal.invalidTextInputProvided",
      ),
      ephemeral: true,
    });

    return;
  }

  await userSettings.delete();
  await modalSubmitInteraction.reply({
    content: t(
      "interaction.commands.profile.deleteProfileModal.removeDataSuccess",
    ),
    ephemeral: true,
  });
};
