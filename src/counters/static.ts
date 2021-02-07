import Counter from "../typings/Counter";

const StaticCounter: Counter = {
	aliases: ["static"],
	isPremium: false,
	isEnabled: true,
	lifetime: 0,
	execute: async ({ client, guild, guildSettings, resource }) => {
		return Number(resource) ?? resource;
	}
};

export default StaticCounter;
