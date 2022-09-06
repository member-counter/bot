import { ButtonInteraction } from "discord.js";
import logger from "../../logger"
import { deleteGuildSettings } from "./deleteGuildSettings";

export const allButtons: ((
	buttonInteraction: ButtonInteraction
) => Promise<void> | void)[] = [deleteGuildSettings];

export default async function handleButton(
	buttonInteraction: ButtonInteraction
): Promise<void> {
	await Promise.all(allButtons.map((button) => button(buttonInteraction)));
}
