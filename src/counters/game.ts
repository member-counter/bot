import Counter from "../typings/Counter";
import Constants from "../utils/Constants";
import { query, Type } from "gamedig";
import fetch from 'node-fetch';
import AbortController from 'abort-controller';
import * as packageJSON from '../../package.json';
import timeoutFetch from '../utils/timeoutFetch';

const GameCounter: Counter = {
	aliases: ['game'],
	isPremium: false,
	isEnabled: true,
	lifetime: 5 * 1000,
	execute: async ({ client, guild, resource }) => {
		let splited = resource.split(':');

		const type = splited[0];
		const host = splited[1];
		const port = parseInt(splited[2], 10);

		if (!host) throw new Error("You must provide an adress and port");

		switch (type) {
			case "ragemp": {
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
					return result?.[`${host}:${port}`]?.players;
				} else {
					controller.abort();
					throw new Error(
						`[GTA5 RAGE-MP] Invalid status code (not 200) in: ${resource}`,
					);
				}
				break;
			}

			default: {
				console.log({ type: type as Type, host, port, maxAttempts: 5 });
				const response = await query({ type: type as Type, host, port, maxAttempts: 5 });
				return response?.players?.length
				
				break;
			}
		}
	}
}

export default GameCounter;