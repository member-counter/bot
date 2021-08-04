import GuildCountCacheModel from "../models/GuildCountCache";
import Counter from "../typings/Counter";
import Constants from "../utils/Constants";

const MemberCounter: Counter = {
	aliases: [
		"members",
		"count",
		"approximatedOnlineMembers",
		"offlineMembers",
		"onlineMembers"
	],
	isPremium: false,
	isEnabled: true,
	lifetime: 0,
	execute: async ({ guild, client }) => {
		let guildCountCache = await GuildCountCacheModel.findOne({
			id: guild.id
		});

		if (guildCountCache) {
			const { members, onlineMembers } = guildCountCache;
			return {
				count: members,
				members,
				onlineMembers,
				offlineMembers: members - onlineMembers,
				approximatedOnlineMembers: onlineMembers
			};
		} else {
			return Constants.CounterResult.NOT_AVAILABLE;
		}
	}
};

export default MemberCounter;
