import fetch from 'node-fetch';
import AbortController from 'abort-controller';
import * as packageJSON from '../../package.json';
import timeoutFetch from '../utils/timeoutFetch';
import Counter from '../typings/Counter';
import Constants from '../utils/Constants';

const GTA5RageMPCounter: Counter = {
	aliases: ['gta5-ragemp'],
	isPremium: false,
	isEnabled: true,
	lifetime: 15 * 1000,
	execute: async ({ guild, resource }) => {
		const controller = new AbortController();
		const response = await timeoutFetch(
			10000,
			fetch(`https://cdn.rage.mp/master/`, {
				signal: controller.signal,
				headers: {
					'User-Agent': `Member Counter Discord Bot/${packageJSON.version}`,
				},
			}),
			controller,
		);

		if (response.status === 200) {
			const result = await response.json();
			return result?.[resource]?.players;
		} else {
			controller.abort();
			throw new Error(
				`[GTA5 RAGE-MP] Invalid status code (not 200) in: ${resource}`,
			);
		}
	},
};

export default GTA5RageMPCounter;
