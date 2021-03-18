import Counter from "../typings/Counter";
import Constants from "../utils/Constants";

const MembersPlayingCounter: Counter = {
	aliases: ["membersplaying"],
	isPremium: false,
	isEnabled: true,
	lifetime: 0,
	execute: async ({ client, guild, resource }) => {
		const counts = {
			["membersplaying"]: 0
		};

		for (const [memberId, member] of guild.members) {
			if (
				!member.bot &&
				member.game &&
				member.game.name.toLowerCase() === resource.toLowerCase()
			) {
				counts["membersplaying"]++;
			}
		}
		return counts;
	}
};

export default MembersPlayingCounter;
