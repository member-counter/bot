import Counter from "../typings/Counter";

const MembersPlayingCounter: Counter = {
	aliases: ["membersplaying"],
	isPremium: true,
	isEnabled: true,
	lifetime: 0,
	execute: async ({ client, guild, unparsedArgs: resource }) => {
		let count = 0;

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
