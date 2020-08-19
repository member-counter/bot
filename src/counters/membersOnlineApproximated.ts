import Counter from '../typings/Counter';
import Constants from '../utils/Constants';
import guildCreate from '../events/guildCreate';

const MembersOnlineApproximatedCounter: Counter = {
	aliases: ['approximatedOnlineMembers'],
	isPremium: false,
	isEnabled: true,
	lifetime: 0,
	execute: async ({ guild, resource }) => {
		const client = guild.shard.client;

		return (await client.getRESTGuild(guild.id, true)).approximatePresenceCount;
	},
};

export default MembersOnlineApproximatedCounter;
