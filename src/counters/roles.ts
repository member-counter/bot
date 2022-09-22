import Counter from "../typings/Counter";
const RolesCounter: Counter<"roles"> = {
	aliases: ["roles"],
	isPremium: false,
	isEnabled: true,
	lifetime: 0,
	execute: async ({ guild }) => {
		return guild.roles.cache.size;
	}
} as const;

export default RolesCounter;
