import Counter from "../typings/Counter";
import Constants from "../utils/Constants";

const MembersWithRoleCounter: Counter = {
	aliases: [
		"membersWithRole",
		"onlineMembersWithRole",
		"offlineMembersWithRole"
	],
	isPremium: true,
	isEnabled: true,
	lifetime: 0,
	execute: async ({ client, guild, unparsedArgs: resource }) => {
		const targetRoles: string[] = resource.split(",");

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
