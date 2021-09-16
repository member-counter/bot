import Counter from "../typings/Counter";

const MembersPlayingCounter: Counter = {
	aliases: ["membersplaying"],
	isPremium: true,
	isEnabled: true,
	lifetime: 0,
	execute: async ({ client, guild, unparsedArgs }) => {
		let count = 0;

		const games = unparsedArgs.split(",").map((game) => game.trim().toLowerCase());

		for (const [memberId, member] of guild.members) {
			if (
				!member.bot &&
				member.game?.name &&
				games.some((game) => game === member.game.name.trim().toLowerCase())
			) {
				count++;
			}
		}
		return count;
	}
};

export default MembersPlayingCounter;
