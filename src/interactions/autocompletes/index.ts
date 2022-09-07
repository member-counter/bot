import { AutocompleteInteraction } from "discord.js";
import { locales } from "./locales";

export const allAutocompletes: ((
	autocomplete: AutocompleteInteraction
) => Promise<void> | void)[] = [locales];

export default async function handleAutocomplete(
	autocompleteInteraction: AutocompleteInteraction
): Promise<void> {
	await Promise.all(
		allAutocompletes.map((autocomplete) =>
			autocomplete(autocompleteInteraction)
		)
	);
}
