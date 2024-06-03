import type { ModalSubmitInteraction } from "discord.js";

import { deleteUserProfileModal } from "./deleteUserProfile";

export const allModals = [deleteUserProfileModal];

export default async function handleAutocomplete(
  modalSubmitInteraction: ModalSubmitInteraction,
) {
  await Promise.all(allModals.map((modal) => modal(modalSubmitInteraction)));
}
