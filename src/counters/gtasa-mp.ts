import query from 'samp-query';
import Counter from '../typings/Counter';
import Constants from '../utils/Constants';

const GTASAMPCounter: Counter = {
	aliases: ['gtasa-mp'],
	isPremium: false,
	isEnabled: true,
	lifetime: 15 * 1000,
	execute: ({ guild, resource }) =>
		new Promise((resolve, reject) => {
			let [host, port] = resource.split(':');
			query({ host, port: parseInt(port, 10) }, function (
				error,
				response,
			) {
				if (error) reject(error);
				resolve(response?.online);
			});
		}),
};

export default GTASAMPCounter;
