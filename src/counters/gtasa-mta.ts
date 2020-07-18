import query from 'mta-query';

export default (resource: string): Promise<number> =>
	new Promise((resolve, reject) => {
		let [host, port] = resource.split(':');
		query({ host, port: parseInt(port, 10) }, function (error, response) {
			if (error) reject(error);
			resolve(response?.online);
		});
	});

import Counter from '../typings/Counter';
import Constants from '../utils/Constants';

const GTASAMTACounter: Counter = {
	aliases: ['gtasa-mta'],
	isPremium: false,
	isEnabled: true,
	lifetime: 15 * 1000,
	execute: async ({ guild, resource }) => {
		return 'Working!';
	},
};

export default GTASAMTACounter;
