import { AutocompleteInteraction } from "discord.js";

import { locales } from "./locales";
import { setupTypes } from "./setupTypes";

export const allAutocompletes: ((
	autocomplete: AutocompleteInteraction
) => Promise<void> | void)[] = [locales, setupTypes];

export default async function handleAutocomplete(
	autocompleteInteraction: AutocompleteInteraction
): Promise<void> {
	await Promise.all(
		allAutocompletes.map((autocomplete) =>
			autocomplete(autocompleteInteraction)
		)
	);
}
