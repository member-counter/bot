import { AutocompleteInteraction } from "discord.js";

import searchInTexts from "../../utils/search";

export const setupTypes = async (
	autocompleteInteraction: AutocompleteInteraction
) => {
	const focusedOption = autocompleteInteraction.options.getFocused(true);

	if (!autocompleteInteraction.inGuild()) return;
	if (autocompleteInteraction.commandName !== "setup") return;
	if (focusedOption.name !== "type") return;
	const types = [
		{ name: "Youtube", value: "youtube" },
		{ name: "Twitch", value: "twitch" },
		{ name: "Twitter", value: "twitter" }
	];

	const searchResults = searchInTexts(
		types.map((e) => e.name),
		focusedOption.value.toString()
	);

	const results = searchResults.map((i) => types[i]).slice(0, 25);

	autocompleteInteraction.respond(results);
};
