import Counter from "../typings/Counter";

const MembersWithRoleCounter: Counter<
	"membersWithRole" | "onlineMembersWithRole" | "offlineMembersWithRole"
> = {
	aliases: [
		"membersWithRole",
		"onlineMembersWithRole",
		"offlineMembersWithRole"
	],
	isPremium: true,
	isEnabled: true,
	lifetime: 0,
	execute: async ({ guild, args }) => {
		const [targetRoles] = args;

		const membersWithRole = new Set<string>();
		const onlineMembersWithRole = new Set<string>();
		const offlineMembersWithRole = new Set<string>();

		guild.members.cache.forEach((member) => {
			targetRoles.forEach((targetRole) => {
				if (member.roles.cache.has(targetRole)) {
					membersWithRole.add(member.id);
					if (
						member.presence.status === "offline" ||
						member.presence.status === undefined
					)
						offlineMembersWithRole.add(member.id);
					else onlineMembersWithRole.add(member.id);
				}
			});
		});

		return {
			membersWithRole: membersWithRole.size,
			onlineMembersWithRole: onlineMembersWithRole.size,
			offlineMembersWithRole: offlineMembersWithRole.size
		} as const;
	}
} as const;

export default MembersWithRoleCounter;
