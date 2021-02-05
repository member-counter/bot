import Counter from "../typings/Counter";
import Constants from "../utils/Constants";

const StaticCounter: Counter = {
	aliases: ["static"],
	isPremium: false,
	isEnabled: true,
	lifetime: 0,
	execute: async ({ client, guild, guildSettings, resource }) => {
		return parseFloat(resource) || resource;
	}
};

export default StaticCounter;
