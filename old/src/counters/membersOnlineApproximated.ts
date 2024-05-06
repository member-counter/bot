import Counter from "../typings/Counter";

const MembersOnlineApproximatedCounter: Counter = {
	aliases: ["approximatedOnlineMembers"],
	isPremium: false,
	isEnabled: true,
	lifetime: 0,
	execute: async ({ guild, client }) => {
		const extendedGuild = await client.getRESTGuild(guild.id, true);
		return extendedGuild.approximatePresenceCount;
	}
};

export default MembersOnlineApproximatedCounter;
