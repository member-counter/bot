import config from "../config";
import Redis from "ioredis";
import { TranslationPlaceholders, Translations } from "../Constants";
import { Interaction } from "discord.js";
import GuildSettings from "./GuildSettings";

const { provider, defaultLocale } = config.i18n;

let redis;

if (provider === "redis") {
	redis = new Redis(config.redis.port, config.redis.host, {
		password: config.redis.password
	});
}

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
];

export async function i18n(interaction: string | Interaction) {
	let locale: string;

	if (typeof interaction === "string") {
		if (!availableLocales.includes(interaction)) throw new Error('Given locale is not supported');
		 	
		locale = interaction; 
	} else {
		if (interaction.inGuild()) {
			const { locale: forcedGuildLocale } = await GuildSettings.init(
				interaction.guildId
			);

			if (availableLocales.includes(interaction.guildLocale)) {
				locale = interaction.guildLocale;
			}

			if (availableLocales.includes(forcedGuildLocale)) {
				locale = forcedGuildLocale;
			}
		} 

		const userLocale = interaction.locale;
		if (availableLocales.includes(userLocale)) {
			locale ??= userLocale;
		} 

		locale ??= config.i18n.defaultLocale;
	}

	async function translate<T extends Translations>(
		desiredTranslation: T,
		placeholderData?: typeof TranslationPlaceholders[T]
	): Promise<string> {
		let translation: string = null;
		switch (provider) {
			case "local": {
				translation ??= (await import(`../locales/${locale}`))[
					desiredTranslation
				];
				translation ??= (await import(`../locales/${defaultLocale}`))[
					desiredTranslation
				];
				break;
			}
			case "redis": {
				translation ??= await redis.get(`i18n:${locale}:${desiredTranslation}`);
				translation ??= await redis.get(
					`i18n:${defaultLocale}:${desiredTranslation}`
				);
				break;
			}
			default:
				throw new Error(`The i18n provider (${provider}) is not valid`);
		}

		if (!translation) {
			throw new Error(`Translation ${desiredTranslation} not found`);
		}

		Object.entries(placeholderData ?? {}).forEach(([key, value]) => {
			translation = translation.replaceAll(`{${key}}`, value.toString());
		});

		return translation;
	}

	return translate;
}
