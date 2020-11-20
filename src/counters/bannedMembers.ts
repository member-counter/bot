import Counter from '../typings/Counter';
import Constants from '../utils/Constants';

const BannedMembersCounter: Counter = {
	aliases: ['bannedMembers'],
	isPremium: false,
	isEnabled: true,
	lifetime: 0,
	execute: async ({ client, guild, resource }) => {
		return guild
			.getBans()
			.then((bans) => bans.length);
	},
};

export default BannedMembersCounter;
