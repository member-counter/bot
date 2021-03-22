import Counter from "../typings/Counter";
import Constants from "../utils/Constants";

const MembersPlayingCounter: Counter = {
	aliases: ["membersplaying"],
	isPremium: false,
	isEnabled: true,
	lifetime: 0,
	execute: async ({ client, guild, resource }) => {
		const count = 0;

		for (const [memberId, member] of guild.members) {
			if (
				!member.bot &&
				member.game &&
				member.game.name.toLowerCase() === resource.toLowerCase()
			) {
				count++;
			}
		}
		return count;
	}
};

export default MembersPlayingCounter;
