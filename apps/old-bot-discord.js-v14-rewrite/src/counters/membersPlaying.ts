import Counter from "../typings/Counter";
const MembersPlayingCounter: Counter<"membersplaying"> = {
	aliases: ["membersplaying"],
	isPremium: true,
	isEnabled: true,
	lifetime: 0,
	execute: async ({ guild, args }) => {
		let count = 0;

		const games = args[0]?.map((game) => game.trim().toLowerCase());

		for (const [, member] of guild.members.cache) {
			if (
				!member.user.bot &&
				member.presence.activities.length > 0 &&
				member.presence.activities
					.map((activity) =>
						games.includes(activity.name) ? activity.name : null
					)
					.filter((el) => el !== null).length > 0
			) {
				count++;
			}
		}
		return count;
	}
} as const;

export default MembersPlayingCounter;
