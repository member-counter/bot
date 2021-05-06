import Counter from "../typings/Counter";

const BotStatsCounter: Counter = {
	aliases: ["member-counter-users", "member-counter-guilds"],
	isPremium: false,
	isEnabled: true,
	lifetime: 0,
	execute: async ({ client, guild, resource }) => {
		const stats = await client.getStats();
		let users = stats.estimatedTotalUsers;
		let guilds = stats.guilds;

		return {
			["member-counter-users"]: users,
			["member-counter-guilds"]: guilds
		};
	}
};

export default BotStatsCounter;
