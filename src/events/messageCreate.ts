import { Message } from "discord.js";

import Constants from "../Constants";
import UserService from "../services/UserService";
import { Event } from "../structures";

export const messageCreateEvent = new Event({
	name: "messageCreate",
	handler: async (message: Message) => {
		if (message.author.bot) return;
		const [, command] = message.content.split(/ +/);

		if (command !== "patpat") {
			return;
		}

		const userSettings = await UserService.init(message.author.id);
		await userSettings.grantBadge(Constants.UserBadges.PATPAT);

		// Huevo de pascua:
		await message.channel.send(
			"https://eduardozgz.com/max?discord_cache_fix=" + Math.random()
		);
		// i never thought i will ever been coding with a very cute guy -alex
	},
	neededIntents: ["GuildMessages"]
});
