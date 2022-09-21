import { Guild } from "discord.js";

import config from "../config";
import logger from "../logger";
import GuildSettings from "../services/GuildSettings";
import { Event } from "../structures";

export const guildCreateEvent = new Event({
	name: "guildCreate",
	handler: async (guild: Guild) => {
		const {
			premium: { thisBotIsPremium, premiumBotId },
			unrestrictedMode
		} = config;
		const guildSettings = await GuildSettings.init(guild.id);

		if (guildSettings.blocked) {
			await guild.leave();
			return;
		}

		await guildSettings.setLocale(guild.preferredLocale);

		// Self kick when premium bot is present and the guild is premium
		if (!thisBotIsPremium && !unrestrictedMode) {
			const premiumBotMember = await guild.members.fetch(premiumBotId);

			if (guildSettings.premium && premiumBotMember) {
				guild.leave().catch(logger.error);
			}
		}
	},
	neededIntents: ["Guilds"]
});
