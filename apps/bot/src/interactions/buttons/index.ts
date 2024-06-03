import type { ButtonInteraction } from "discord.js";

import { deleteUserProfile } from "./deleteUserProfile";

export const allButtons = [deleteUserProfile];

export default async function handleButton(
  buttonInteraction: ButtonInteraction,
) {
  await Promise.all(allButtons.map((button) => button(buttonInteraction)));
}
