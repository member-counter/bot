import { AutocompleteInteraction } from "discord.js";

import { availableLocales, i18nService } from "../../services/i18n";
import { searchInTexts } from "../../utils";

export const locales = async (
	autocompleteInteraction: AutocompleteInteraction
) => {
	const focusedOption = autocompleteInteraction.options.getFocused(true);

	if (!autocompleteInteraction.inGuild()) return;
	if (autocompleteInteraction.commandName !== "settings") return;
	if (focusedOption.name !== "locale") return;

	const desiredLocale = focusedOption.value.toString();
	const i18n = await i18nService(autocompleteInteraction);

	const allLocales = await Promise.all(
		["settingsLanguage", ...availableLocales].map(async (locale) => {
			if (locale === "settingsLanguage") {
				return {
					name: i18n.t(
						"autocomplete.settings.locale.defaultSettingsLanguage"
					) as string,
					value: locale
				};
			} else {
				const i18nInstance = await i18nService(locale);
				return {
					name: i18nInstance.t(
						"autocomplete.settings.locale.localeFromAvailableLanguages",
						{
							LANG_NAME: i18nInstance.t("langName"),
							LANG_CODE: i18nInstance.t("langCode")
						}
					),
					value: locale
				};
			}
		})
	);

	if (desiredLocale.length) {
		allLocales.push({
			name: desiredLocale,
			value: desiredLocale
		});
	}

	const searchResults = searchInTexts(
		allLocales.map((e) => e.name),
		desiredLocale
	);

	const results = searchResults.map((i) => allLocales[i]).slice(0, 25);

	autocompleteInteraction.respond(results);
};
