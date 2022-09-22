import { Counter } from "../typings/Counter";
const MemberCounter: Counter<"members" | "count"> = {
	aliases: ["members", "count"],
	isPremium: false,
	isEnabled: true,
	lifetime: 0,
	execute: async ({ guild }) => {
		return guild.memberCount;
	}
} as const;

export default MemberCounter;
