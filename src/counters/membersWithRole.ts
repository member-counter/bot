import Counter from "../typings/Counter";

const MembersWithRoleCounter: Counter = {
	aliases: [
		"membersWithRole",
		"onlineMembersWithRole",
		"offlineMembersWithRole"
	],
	isPremium: true,
	isEnabled: false,
	lifetime: 0,
	execute: async ({ client, guild, args }) => {
		const targetRoles: string[] = args[0];

		const membersWithRole = new Set<string>();
		const onlineMembersWithRole = new Set<string>();
		const offlineMembersWithRole = new Set<string>();

		guild.members.forEach((member) => {
			targetRoles.forEach((targetRole) => {
				if (member.roles.includes(targetRole)) {
					membersWithRole.add(member.id);
					if (member.status === "offline" || member.status === undefined)
						offlineMembersWithRole.add(member.id);
					else onlineMembersWithRole.add(member.id);
				}
			});
		});

		return {
			membersWithRole: membersWithRole.size,
			onlineMembersWithRole: onlineMembersWithRole.size,
			offlineMembersWithRole: offlineMembersWithRole.size
		};
	}
};

export default MembersWithRoleCounter;
