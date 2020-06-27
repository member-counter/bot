import fetch from 'node-fetch';
import AbortController from 'abort-controller';
import * as packageJSON from '../../../package.json';

export default (resource: string): Promise<number> =>
	new Promise(async (resolve, reject) => {
		let count: number = 0;

		const controller = new AbortController();
		setTimeout(() => {
			controller.abort();
			reject(new Error(`[FIVEM] HTTP request time out: ${resource}`));
		}, 10 * 1000);

		const response = await fetch(`http://${resource}/players.json`, {
			signal: controller.signal,
			headers: {
				'User-Agent': `Member Counter Discord Bot/${packageJSON.version}`,
			},
		});

		if (response.status === 200) {
			const result = await response.json();
			count = result?.length;
		} else {
      controller.abort();
			reject(new Error(`[FIVEM] Invalid status code (not 200) in: ${resource}`));
		}

		resolve(count);
	});
