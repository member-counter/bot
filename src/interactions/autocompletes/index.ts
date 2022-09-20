import { AutocompleteInteraction } from "discord.js";

import { languages } from "./languages";
import { locales } from "./locales";

export const allAutocompletes: ((
	autocomplete: AutocompleteInteraction
) => Promise<void> | void)[] = [languages, locales];

export default async function handleAutocomplete(
	autocompleteInteraction: AutocompleteInteraction
): Promise<void> {
	await Promise.all(
		allAutocompletes.map((autocomplete) =>
			autocomplete(autocompleteInteraction)
		)
	);
}
