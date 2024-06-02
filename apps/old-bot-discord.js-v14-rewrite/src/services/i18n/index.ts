import { ChatInputCommandInteraction, Interaction } from "discord.js";
import i18next, { createInstance } from "i18next";

import config from "../../config";
import GuildSettings from "../GuildSettings";
import { LocalBackend } from "./LocalBackend";
import { RedisBackend } from "./RedisBackend";
import { TranslateFunction } from "./i18n";
export const availableLocales = [
	"ca-ES",
	"cs-CZ",
	"de-DE",
	"en-US",
	"es-ES",
	"fa-IR",
	"fr-FR",
	"he-IL",
	"hi-IN",
	"it-IT",
	"pl-PL",
	"pt-BR",
	"ru-RU",
	"tr-TR"
] as const;
export type i18nInstanceType = Omit<ReturnType<typeof createInstance>, "t"> & {
	t: TranslateFunction;
};
export async function i18nService(
	interaction: string | Interaction | ChatInputCommandInteraction
) {
	let locale: string;

	if (typeof interaction === "string") {
		if (
			!availableLocales.includes(interaction as typeof availableLocales[number])
		)
			throw new Error("Given locale is not supported");

		locale = interaction;
	} else {
		if (interaction.inGuild()) {
			const { language: forcedGuildLocale } = await GuildSettings.init(
				interaction.guildId
			);

			if (
				availableLocales.includes(
					interaction.guildLocale as typeof availableLocales[number]
				)
			) {
				locale = interaction.guildLocale;
			}

			if (availableLocales.includes(forcedGuildLocale as any)) {
				locale = forcedGuildLocale;
			}
		}

		const userLocale = interaction.locale as typeof availableLocales[number];
		if (availableLocales.includes(userLocale)) {
			locale ??= userLocale;
		}

		locale ??= config.i18n.defaultLocale;
	}

	const { createInstance } = i18next;
	const i18nextInstance = await new Promise<i18nInstanceType>(
		(resolve, reject) => {
			let backend;
			switch (config.i18n.provider) {
				case "redis":
					backend = RedisBackend;
					break;

				case "local":
				default:
					backend = LocalBackend;
					break;
			}

			const instance = createInstance().use(backend);

			instance.init(
				{
					fallbackLng: [locale, config.i18n.defaultLocale],
					load: "currentOnly",
					interpolation: {
						escapeValue: false
					}
				},
				(err) => {
					if (err) return reject(err);
					resolve(instance);
				}
			);
		}
	);

	// TODO: override locale for number and date formatting with guildSettings locale

	return i18nextInstance;
}
