import Counter from "../typings/Counter";
const MembersOnlineApproximatedCounter: Counter<"approximatedOnlineMembers"> = {
	aliases: ["approximatedOnlineMembers"],
	isPremium: false,
	isEnabled: true,
	lifetime: 0,
	execute: async ({ guild }) => {
		return guild.approximatePresenceCount;
	}
} as const;

export default MembersOnlineApproximatedCounter;
