import Counter from "../typings/Counter";
import getEnv from "../utils/getEnv";

const { PREMIUM_BOT } = getEnv();

const MemberCounter: Counter = {
	aliases: ["members", "count"],
	isPremium: false,
	isEnabled: true,
	lifetime: 0,
	execute: async ({ guild, client }) => {
		return guild.memberCount;
	}
};

export default MemberCounter;
