import { stat } from 'fs';
import Counter from '../typings/Counter';

const BotStatsCounter: Counter = {
	aliases: ['member-counter-users', 'member-counter-guilds'],
	isPremium: false,
	isEnabled: true,
	lifetime: 0,
	execute: async ({ client, guild, resource }) => {
		let users = null;
		let guilds = null;

		if (client.getStats) {
			const stats = await client.getStats();
			users = stats.estimatedTotalUsers;
			guilds = stats.guilds;
		} else {
			users = client.guilds.reduce(
				(acc, curr) => acc + curr.memberCount,
				0,
			);
			guilds = client.guilds.size;
		}

		return {
			['member-counter-users']: users,
			['member-counter-guilds']: guilds,
		};
	},
};

export default BotStatsCounter;
