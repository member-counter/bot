import { AutocompleteInteraction } from "discord.js";
import GuildSettings from "../../services/GuildSettings";
import { availableLocales, i18n } from "../../services/i18n";
import searchInTexts from "../../utils/search";

export const locales = async (autocompleteInteraction: AutocompleteInteraction) => {
	const focusedOption = autocompleteInteraction.options.getFocused(true);

	if (!autocompleteInteraction.inGuild()) return;
	if (autocompleteInteraction.commandName !== "settings") return;
	if (focusedOption.name !== "language") return;

	const guildSettings = await GuildSettings.init(autocompleteInteraction.guildId);

	const allLocales = await Promise.all(
		["server", ...availableLocales].map(async (locale) => {
			if (locale === "server") {
				return {
					name: await(await i18n(autocompleteInteraction))(
						"AUTOCOMPLETE_DEFAULT_SERVER_LOCALE"
					),
					value: locale
				};
			} else {
				return { name: await (await i18n(locale))("LANG_NAME"), value: locale };
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
