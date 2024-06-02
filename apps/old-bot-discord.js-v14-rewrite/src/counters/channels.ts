import { ChannelType } from "discord.js";

import Counter from "../typings/Counter";
const ChannelCounter: Counter<"channels"> = {
	aliases: ["channels"],
	isPremium: false,
	isEnabled: true,
	lifetime: 0,
	execute: async ({ guild, args }) => {
		const targetCategories = args[0] ?? [];

		if (targetCategories.length) {
			return guild.channels.cache.filter((channel) =>
				targetCategories.includes(channel.parentId)
			).size;
		}

		return guild.channels.cache.filter(
			(channel) => channel.type !== ChannelType.GuildCategory
		).size;
	}
} as const;

export default ChannelCounter;
