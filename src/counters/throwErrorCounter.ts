import Counter from '../typings/Counter';
import Constants from '../utils/Constants';

const ErrorCounter: Counter = {
	aliases: ['error'],
	isPremium: false,
	isEnabled: true,
	lifetime: 0,
	execute: async ({ client, guild, resource }) => {
		throw new Error('Error!!!')
	},
};

export default ErrorCounter;
