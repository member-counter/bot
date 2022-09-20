import { Guild } from "discord.js";

import config from "../config";
import logger from "../logger";
import GuildSettings from "../services/GuildSettings";
import { availableLocales } from "../services/i18n";
import { Event } from "../structures";

export const guildCreateEvent = new Event({
	name: "guildCreate",
	handler: async (guild: Guild) => {
		const {
			premium: { thisBotsIsPremium: PREMIUM_BOT, premiumBotId: PREMIUM_BOT_ID },
			unrestrictedMode: UNRESTRICTED_MODE
		} = config;
		const guildSettings = await GuildSettings.init(guild.id);

		if (guildSettings.blocked) {
			await guild.leave();
			return;
		}

		await guildSettings.setLocale(guild.preferredLocale);

		// Self kick when premium bot is present and the guild is premium
		if (!PREMIUM_BOT && !UNRESTRICTED_MODE) {
			const premiumBotMember = guild.members.cache.get(PREMIUM_BOT_ID);

			if (guildSettings.premium && premiumBotMember) {
				guild.leave().catch(logger.error);
			}
		}

		// set language
		const languageToSet = guild.preferredLocale.replace(/-/g, "_");
		if (
			availableLocales.includes(
				languageToSet as typeof availableLocales[number]
			)
		) {
			await guildSettings.setLanguage(languageToSet);
		}
	},
	neededIntents: ["Guilds"]
});
