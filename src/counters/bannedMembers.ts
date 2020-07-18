import Counter from '../typings/Counter';
import Constants from '../utils/Constants';

const BannedMembersCounter: Counter = {
	aliases: ['bannedMembers'],
	isPremium: false,
	isEnabled: true,
	lifetime: 0,
	execute: async ({ client, guild, resource }) => {
			//@ts-ignore
		return await guild
			.getBans()
			.then((bans) => bans.length);
	},
};

export default BannedMembersCounter;
