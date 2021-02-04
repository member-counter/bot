import fetch from 'node-fetch';
import AbortController from 'abort-controller';
import * as packageJSON from '../../package.json';
import timeoutFetch from '../utils/timeoutFetch';
import Counter from '../typings/Counter';

const HTTPCounter: Counter = {
	aliases: ['http', 'https'],
	isPremium: false,
	isEnabled: true,
	lifetime: 1 * 60 * 1000,
	execute: async ({ guild, resource }) => {
		// TODO add json support and refactor
		const controller = new AbortController();
		const response = await timeoutFetch(
			10000,
			fetch(resource, {
				signal: controller.signal,
				headers: {
					'User-Agent': `Member Counter Discord Bot/${packageJSON.version}`,
					Accept: 'text/plain',
				},
			}),
			controller,
		);

		if (
			response.status === 200 &&
			response.headers.get('Content-Type').includes('text/plain')
		) {
			return parseFloat(await response.text());
		} else {
			controller.abort();
			throw new Error(`Invalid status code (not 200) or invalid Content-Type (not text/plain) in: ${resource}`);
		}
	},
};

export default HTTPCounter;
