import type { ButtonInteraction } from "discord.js";
import {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
} from "@discordjs/builders";
import { TextInputStyle } from "discord.js";

import { InteractionId } from "~/Constants";
import { initI18n } from "~/i18n";

export const deleteUserProfile = async (
  buttonInteraction: ButtonInteraction,
) => {
  const name = buttonInteraction.customId;

  if (name !== InteractionId.Profile.DeleteUserProfile.Button) return;
  const { t } = await initI18n(buttonInteraction);

  await buttonInteraction.showModal(
    new ModalBuilder()
      .setTitle(t("interaction.commands.profile.deleteProfileModal.modalTitle"))
      .setCustomId(InteractionId.Profile.DeleteUserProfile.Modal)
      .addComponents(
        new ActionRowBuilder<TextInputBuilder>().addComponents(
          new TextInputBuilder()
            .setLabel(
              t(
                "interaction.commands.profile.deleteProfileModal.removeDataConfirmation",
                {
                  CONFIRMATION_STRING: t(
                    "interaction.commands.profile.deleteProfileModal.removeDataConfirmationString",
                  ),
                },
              ),
            )
            .setCustomId(
              InteractionId.Profile.DeleteUserProfile.ModalConfirmationText,
            )
            .setRequired(true)
            .setPlaceholder(
              t(
                "interaction.commands.profile.deleteProfileModal.removeDataConfirmationString",
              ),
            )
            .setStyle(TextInputStyle.Short),
        ),
      ),
  );
};
