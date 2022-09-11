import { AutocompleteInteraction } from "discord.js";

import { availableLocales, i18n } from "../../services/i18n";
import searchInTexts from "../../utils/search";

export const locales = async (
	autocompleteInteraction: AutocompleteInteraction
) => {
	const focusedOption = autocompleteInteraction.options.getFocused(true);

	if (!autocompleteInteraction.inGuild()) return;
	if (autocompleteInteraction.commandName !== "settings") return;
	if (focusedOption.name !== "language") return;

	const allLocales = await Promise.all(
		["server", ...availableLocales].map(async (locale) => {
			if (locale === "server") {
				const i18nInstance = await i18n(autocompleteInteraction);
				return {
					name: i18nInstance.t("autocomplete.defaultServerLocale"),
					value: locale
				};
			} else {
				const i18nInstance = await i18n(locale);
				return {
					name: i18nInstance.t("langName"),
					value: locale
				};
			}
		})
	);

	const searchResults = searchInTexts(
		allLocales.map((e) => e.name),
		focusedOption.value.toString()
	);

	const results = searchResults.map((i) => allLocales[i]).slice(0, 25);

	autocompleteInteraction.respond(results);
};
