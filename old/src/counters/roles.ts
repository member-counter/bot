import Counter from "../typings/Counter";

const RolesCounter: Counter = {
	aliases: ["roles"],
	isPremium: false,
	isEnabled: true,
	lifetime: 0,
	execute: async ({ guild }) => {
		return guild.roles.size;
	}
};

export default RolesCounter;
