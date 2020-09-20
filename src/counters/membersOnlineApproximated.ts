import Counter from '../typings/Counter';
import getEnv from '../utils/getEnv';

const { PREMIUM_BOT } = getEnv();

const MembersOnlineApproximatedCounter: Counter = {
	aliases: ['approximatedOnlineMembers'],
	isPremium: false,
	isEnabled: true,
	lifetime: 0,
	execute: async ({ guild, client }) => {
		const extendedGuild = await client.getRESTGuild(guild.id, true);
	
    if (PREMIUM_BOT) {
			return extendedGuild.approximatePresenceCount;
    } else {
      return {
        members: extendedGuild.approximateMemberCount,
        approximatedOnlineMembers: extendedGuild.approximatePresenceCount,
      };
    }
	},
};

export default MembersOnlineApproximatedCounter;
