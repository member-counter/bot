import { CommandInteraction, Interaction } from "discord.js";
import i18next from "i18next";

import config from "../../config";
import GuildSettings from "../GuildSettings";
import { LocalBackend } from "./LocalBackend";
import { RedisBackend } from "./RedisBackend";

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

export async function i18n(
	interaction: string | Interaction | CommandInteraction
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
			const { locale: forcedGuildLocale } = await GuildSettings.init(
				interaction.guildId
			);

			if (
				availableLocales.includes(
					interaction.guildLocale as typeof availableLocales[number]
				)
			) {
				locale = interaction.guildLocale;
			}

			if (availableLocales.includes(forcedGuildLocale)) {
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
	const i18nextInstance = await new Promise<ReturnType<typeof createInstance>>(
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
					lng: locale,
					fallbackLng: config.i18n.defaultLocale,
					load: "currentOnly"
				},
				(err) => {
					if (err) return reject(err);
					resolve(instance);
				}
			);
		}
	);

	return i18nextInstance;
}
