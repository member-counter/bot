import Eris from "eris";
import Counter from "../typings/Counter";

const ChannelCounter: Counter = {
	aliases: ["channels"],
	isPremium: false,
	isEnabled: true,
	lifetime: 0,
	execute: async ({ guild, args }) => {
		const targetCategories = args[0] ?? [];

		if (targetCategories.length) {
			return guild.channels.filter((channel) =>
				targetCategories.includes(channel.parentID)
			).length;
		}

		return guild.channels.filter(
			(channel) => channel.type !== Eris.Constants.ChannelTypes.GUILD_CATEGORY
		).length;
	}
};

export default ChannelCounter;
