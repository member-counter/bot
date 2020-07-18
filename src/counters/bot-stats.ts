import Counter from '../typings/Counter';
import Constants from '../utils/Constants';

const BotStatsCounter: Counter = {
	aliases: ['member-counter-users', 'member-counter-guilds'],
	isPremium: false,
	isEnabled: true,
	lifetime: 0,
	execute: async ({ client, guild, resource }) => {
		return {
			['member-counter-users']: client.guilds.reduce(
				(acc, curr) => acc + curr.memberCount,
				0,
			),
			['member-counter-guilds']: client.guilds.size,
		};
	},
};

export default BotStatsCounter;
