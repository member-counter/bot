import Counter from "../typings/Counter";
import Constants from "../utils/Constants";

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
	execute: async ({ client, guild, resource }) => {
		const counts = {
			["bots"]: 0,
			["users"]: 0,
			["onlinemembers"]: 0,
			["offlinemembers"]: 0,
			["onlineusers"]: 0,
			["offlineusers"]: 0,
			["onlinebots"]: 0,
			["offlinebots"]: 0
		};

		for (const [memberId, member] of guild.members) {
			const memberIsOffline =
				member.status === "offline" || member.status === undefined;

			if (member.bot) counts["bots"]++;
			else counts["users"]++;

			if (memberIsOffline) counts["offlinemembers"]++;
			else counts["onlinemembers"]++;

			if (memberIsOffline && member.bot) counts["offlinebots"]++;
			else if (memberIsOffline) counts["offlineusers"]++;

			if (!memberIsOffline && member.bot) counts["onlinebots"]++;
			else if (!memberIsOffline) counts["onlineusers"]++;
		}
		return counts;
	}
};

export default MembersExtendedCounter;
