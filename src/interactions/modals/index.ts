import { ModalSubmitInteraction } from "discord.js";

import { profileModel } from "./profile";
export const allModals: ((
	modal: ModalSubmitInteraction
) => Promise<void> | void)[] = [profileModel];

// TODO: use constants for customIds for all interactions
export default async function handleAutocomplete(
	modalSubmitInteraction: ModalSubmitInteraction
): Promise<void> {
	await Promise.all(allModals.map((modal) => modal(modalSubmitInteraction)));
}
