import { AutocompleteInteraction } from "discord.js";

import { searchInTexts } from "../../utils";

export const actions = async (
	autocompleteInteraction: AutocompleteInteraction
) => {
	const focusedOption = autocompleteInteraction.options.getFocused(true);

	if (!autocompleteInteraction.inGuild()) return;
	if (autocompleteInteraction.commandName !== "profile") return;
	if (focusedOption.name !== "action") return;

	const desiredAction = focusedOption;

	const allActions = [
		{ name: "Grant Badge", value: "grantbadge" },
		{ name: "Grant Credit", value: "grantcredit" },
		{ name: "Grant Server Upgrade", value: "grantserverupgrade" },
		{ name: "Revoke Badge", value: "revokebadge" }
	];

	const searchResults = searchInTexts(
		allActions.map((e) => e.name),
		desiredAction.value.toString()
	);

	const results = searchResults.map((i) => allActions[i]).slice(0, 25);

	autocompleteInteraction.respond(results);
};
