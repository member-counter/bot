import Counter from "../typings/Counter";

const BannedMembersCounter: Counter = {
	aliases: ["bannedMembers"],
	isPremium: false,
	isEnabled: true,
	lifetime: 0,
	execute: async ({ guild }) => {
		return guild.getBans().then((bans) => bans.length);
	}
};

export default BannedMembersCounter;
