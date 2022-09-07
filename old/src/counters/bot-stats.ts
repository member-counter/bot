import Counter from "../typings/Counter";

const BotStatsCounter: Counter = {
	aliases: ["member-counter-users", "member-counter-guilds"],
	isPremium: false,
	isEnabled: true,
	lifetime: 0,
	execute: async ({ client }) => {
		const stats = await client.getStats();
		const users = stats.estimatedTotalUsers;
		const { guilds } = stats;

		return {
			["member-counter-users"]: users,
			["member-counter-guilds"]: guilds
		};
	}
};

export default BotStatsCounter;
