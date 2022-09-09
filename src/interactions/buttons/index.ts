import { ButtonInteraction } from "discord.js";

import { resetGuildSettings } from "./resetGuildSettings";

export const allButtons: ((
	buttonInteraction: ButtonInteraction
) => Promise<void> | void)[] = [resetGuildSettings];

export default async function handleButton(
	buttonInteraction: ButtonInteraction
): Promise<void> {
	await Promise.all(allButtons.map((button) => button(buttonInteraction)));
}
