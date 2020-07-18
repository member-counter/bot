//@ts-ignore
import query from 'source-server-query';
import Counter from '../typings/Counter';
import Constants from '../utils/Constants';

const SoruceCounter: Counter = {
	aliases: ['source'],
	isPremium: false,
	isEnabled: true,
	lifetime: 15 * 1000,
	execute: async ({ guild, resource }) => {
		let count = 0;
		let [host, port] = resource.split(':');

		const response = await query.info(host, parseInt(port, 10), 2000);

		if (response.constructor.name === 'Error') {
			throw response;
		} else {
			count = Number(response?.playersnum);
		}

		return count;
	},
};

export default SoruceCounter;
