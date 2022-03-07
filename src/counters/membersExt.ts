import Counter from "../typings/Counter";

const MembersExtendedCounter: Counter = {
	aliases: [
		"bots",
		"users",
		"onlinemembers",
		"offlinemembers",
		"onlineusers",
		"offlineusers",
		"onlinebots",
		"offlinebots"
	],
	isPremium: true,
	isEnabled: true,
	lifetime: 0,
	execute: async ({ guild }) => {
		const counts = {
			bots: 0,
			users: 0,
			onlineMembers: 0,
			offlineMembers: 0,
			onlineUsers: 0,
			offlineUsers: 0,
			onlineBots: 0,
			offlineBots: 0
		};

		for (const [memberId, member] of guild.members) {
			const memberIsOffline =
				member.status === "offline" || member.status === undefined;

			if (member.bot) {
				counts.bots++;
				if (memberIsOffline) {
					counts.offlineMembers++;
					counts.offlineBots++;
				} else {
					counts.onlineMembers++;
					counts.onlineBots++;
				}
			} else {
				counts.users++;
				if (memberIsOffline) {
					counts.offlineMembers++;
					counts.offlineUsers++;
				} else {
					counts.onlineMembers++;
					counts.onlineUsers++;
				}
			}
		}
		return counts;
	}
};

export default MembersExtendedCounter;
