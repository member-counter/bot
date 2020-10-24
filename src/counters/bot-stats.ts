import GuildCountCacheModel from '../models/GuildCountCache';
import Counter from '../typings/Counter';
import Constants from '../utils/Constants';

const BotStatsCounter: Counter = {
	aliases: ['member-counter-users', 'member-counter-guilds'],
	isPremium: false,
	isEnabled: true,
	lifetime: 0,
	execute: async ({ client, guild, resource }) => {
		return (await GuildCountCacheModel.aggregate([{
			$group: {
				_id: null,
				total: {
					$sum: "$members"
				}
			}
		}]))[0].total;
	},
};

export default BotStatsCounter;
