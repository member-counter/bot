import Counter from "../typings/Counter";
const MembersExtendedCounter: Counter<
	| "bots"
	| "users"
	| "onlinemembers"
	| "offlinemembers"
	| "onlineusers"
	| "offlineusers"
	| "onlinebots"
	| "offlinebots"
> = {
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

		for (const [, member] of guild.members.cache) {
			const memberIsOffline =
				member.presence.status === "offline" ||
				member.presence.status === undefined;

			if (member.user.bot) {
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
} as const;

export default MembersExtendedCounter;
