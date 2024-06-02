import Counter from "../typings/Counter";

const BotStatsCounter: Counter<
	"member-counter-users" | "member-counter-guilds"
> = {
	aliases: ["member-counter-users", "member-counter-guilds"],
	isPremium: false,
	isEnabled: true,
	lifetime: 0,
	execute: async ({ client }) => {
		const users = client.users.cache.size;
		const guilds = client.guilds.cache.size;

		return {
			["member-counter-users"]: users,
			["member-counter-guilds"]: guilds
		} as const;
	}
} as const;

export default BotStatsCounter;
