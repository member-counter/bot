import Counter from '../typings/Counter';

const NitroBoostersCounter: Counter = {
	aliases: ['nitro-boosters'],
	isPremium: false,
	isEnabled: true,
	lifetime: 0,
	execute: async ({ guild }) => guild.premiumSubscriptionCount,
};

export default NitroBoostersCounter;
