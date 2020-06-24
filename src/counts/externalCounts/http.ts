import fetch from 'node-fetch';
import AbortController from 'abort-controller';
import * as packageJSON from '../../../package.json';

export default (resource: string): Promise<number> =>
	new Promise(async (resolve, reject) => {
		let count: number = 0;

		const controller = new AbortController();
		const timeout = setTimeout(() => {
			controller.abort();
			reject(new Error(`HTTP request time out: ${resource}`));
		}, 10 * 1000);

		const response = await fetch(resource, {
			signal: controller.signal,
			headers: {
				'User-Agent': `Member Counter Discord Bot/${packageJSON.version}`,
				Accept: 'text/plain',
			},
		});

		if (
			response.status === 200 &&
			response.headers.get('Content-Type').includes('text/plain')
		) {
			count = parseInt(await response.text(), 10);
		} else {
			controller.abort();
			reject(new Error(
				`Invalid status code (not 200) in: ${resource}`,
			));
		}

		resolve(count);
	});
