import Counter from "../typings/Counter";

const MembersExtendedCounter: Counter = {
	aliases: [
		"bots",
		"users",
		"onlineusers",
		"offlineusers",
		"onlinebots",
		"offlinebots"
	],
	isPremium: true,
	isEnabled: false,
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

			if (member.bot) counts.bots++;
			else counts.users++;

			if (memberIsOffline) counts.offlineMembers++;
			else counts.onlineMembers++;

			if (memberIsOffline && member.bot) counts.offlineBots++;
			else if (memberIsOffline) counts.offlineUsers++;

			if (!memberIsOffline && member.bot) counts.onlineBots++;
			else if (!memberIsOffline) counts.onlineUsers++;
		}
		return counts;
	}
};

export default MembersExtendedCounter;
