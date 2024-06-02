import Counter from "../typings/Counter";

const BannedMembersCounter: Counter<"bannedMembers"> = {
	aliases: ["bannedMembers"],
	isPremium: false,
	isEnabled: true,
	lifetime: 0,
	execute: async ({ guild }) => {
		return guild.bans.fetch().then((bans) => bans.size);
	}
};

export default BannedMembersCounter;
