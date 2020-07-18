import Counter from '../typings/Counter';
import Constants from '../utils/Constants';
import fetch from 'node-fetch';
import AbortController from 'abort-controller';
import * as packageJSON from '../../package.json';
import timeoutFetch from '../utils/timeoutFetch';

const GTA5FiveMCounter: Counter = {
	aliases: ['gta5-fivem'],
	isPremium: false,
	isEnabled: true,
	lifetime: 15 * 1000,
	execute: async ({ guild, resource }) => {
		const controller = new AbortController();
		const response = await timeoutFetch(
			10000,
			fetch(`http://${resource}/players.json`, {
				signal: controller.signal,
				headers: {
					'User-Agent': `Member Counter Discord Bot/${packageJSON.version}`,
				},
			}),
			controller,
		);

		if (response.status === 200) {
			const result = await response.json();
			return result?.length;
		} else {
			controller.abort();
			throw new Error(
				`[FIVEM] Invalid status code (not 200) in: ${resource}`,
			);
		}
	},
};

export default GTA5FiveMCounter;
