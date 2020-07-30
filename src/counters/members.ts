import Counter from '../typings/Counter';
import Constants from '../utils/Constants';

const MemberCounter: Counter = {
	aliases: ['members'],
	isPremium: false,
	isEnabled: true,
	lifetime: 0,
	execute: async ({ guild, resource }) => {
		return guild.memberCount;
	},
};

export default MemberCounter;
