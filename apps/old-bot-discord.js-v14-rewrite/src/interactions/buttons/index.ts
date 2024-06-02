import { ButtonInteraction } from "discord.js";

import { resetGuildSettings } from "./resetGuildSettings";
import { deleteUserProfile } from "./deleteUserProfile";
import { profileActions } from "./profileActions";

export const allButtons: ((
	buttonInteraction: ButtonInteraction
) => Promise<void> | void)[] = [
	resetGuildSettings,
	deleteUserProfile,
	profileActions
];

export default async function handleButton(
	buttonInteraction: ButtonInteraction
): Promise<void> {
	await Promise.all(allButtons.map((button) => button(buttonInteraction)));
}
