import Counter from '../typings/Counter';
import Constants from '../utils/Constants';

const MyCounter: Counter = {
	aliases: ['myCounter', 'myRandomCounter'],
	isPremium: false,
	isEnabled: false,
	lifetime: 0,
	execute: async ({ client, guild, resource }) => {
		// return 1234567890;
		// return "Working!";
		// return { myCounter: Date.now(), myRandomCounter: "Working!" };
		// return Constants.CounterResult.ERROR;
		return 1337;
	},
};

export default MyCounter;
