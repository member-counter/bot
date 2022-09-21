import { Guild } from "discord.js";

import config from "../config";
import logger from "../logger";
import GuildSettings from "../services/GuildSettings";
import { Event } from "../structures";

export const guildCreateEvent = new Event({
	name: "guildCreate",
	handler: async (guild: Guild) => {
		// TODO: use names directly
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
			// TODO: fetch because it wont be in the cache
			const premiumBotMember = guild.members.cache.get(PREMIUM_BOT_ID);

			if (guildSettings.premium && premiumBotMember) {
				guild.leave().catch(logger.error);
			}
		}
	},
	neededIntents: ["Guilds"]
});
