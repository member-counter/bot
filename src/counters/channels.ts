import Eris from "eris";
import Counter from "../typings/Counter";

const ChannelCounter: Counter = {
	aliases: ["channels"],
	isPremium: false,
	isEnabled: true,
	lifetime: 0,
	execute: async ({ guild, unparsedArgs: resource }) => {
		return guild.channels.filter(
			(channel) => channel.type !== Eris.Constants.ChannelTypes.GUILD_CATEGORY
		).length;
	}
};

export default ChannelCounter;
