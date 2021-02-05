import Counter from "../typings/Counter";
import Constants from "../utils/Constants";

const ChannelCounter: Counter = {
	aliases: ["channels"],
	isPremium: false,
	isEnabled: true,
	lifetime: 0,
	execute: async ({ guild, resource }) => {
		return guild.channels.filter((channel) => channel.type !== 4).length;
	}
};

export default ChannelCounter;
