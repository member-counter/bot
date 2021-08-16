import Counter from "../typings/Counter";
import { query, Type } from "gamedig";
import fetch from "node-fetch";
import AbortController from "abort-controller";
import * as packageJSON from "../../package.json";
import timeoutFetch from "../utils/timeoutFetch";

const GameCounter: Counter = {
	aliases: ["game"],
	isPremium: false,
	isEnabled: true,
	lifetime: 5 * 1000,
	execute: async ({ client, guild, unparsedArgs: resource, args }) => {
		const type = args[0];
		const host = args[1];
		const port = parseInt(args[2], 10);

		if (!host) throw new Error("You must provide an address and port");
		switch (type) {
			case "ragemp": {
				const controller = new AbortController();
				const response = await timeoutFetch(
					10000,
					fetch(`https://cdn.rage.mp/master/`, {
						signal: controller.signal,
						headers: {
							"User-Agent": `Member Counter Discord Bot/${packageJSON.version}`
						}
					}),
					controller
				);

				if (response.status === 200) {
					const result = await response.json();
					return result?.[`${host}:${port}`]?.players;
				} else {
					controller.abort();
					throw new Error(
						`[GTA5 RAGE-MP] Invalid status code (not 200) in: ${host}:${port}`
					);
				}
				break;
			}

			case "fivem-alt": {
				let hostname = host;
				if (!Number.isNaN(port)) hostname += ":" + port;

				const controller = new AbortController();
				const response = await timeoutFetch(
					10000,
					fetch(`http://${hostname}/players.json`, {
						signal: controller.signal,
						headers: {
							"User-Agent": `Member Counter Discord Bot/${packageJSON.version}`
						}
					}),
					controller
				);

				if (response.status === 200) {
					const result = await response.json();
					return result.length;
				} else {
					controller.abort();
					throw new Error(
						`[GTA5 FIVEM-ALT] Invalid status code (not 200) in: ${hostname}`
					);
				}
				break;
			}

			case "minecraft-alt": {
				let hostname = host;
				if (!Number.isNaN(port)) hostname += ":" + port;

				const controller = new AbortController();
				const response = await timeoutFetch(
					10000,
					fetch(`https://api.mcsrvstat.us/2/${hostname}`, {
						signal: controller.signal,
						headers: {
							"User-Agent": `Member Counter Discord Bot/${packageJSON.version}`
						}
					}),
					controller
				);

				if (response.status === 200) {
					const data = await response.json();
					if (data.online) {
						return data.players?.online;
					} else {
						throw new Error(
							`[Minecraft Alternative] Server offline or invalid address: ${hostname}`
						);
					}
				} else {
					controller.abort();
					throw new Error(
						`[Minecraft Alternative] Invalid status code (not 200) in: ${hostname}`
					);
				}
				break;
			}

			default: {
				const response = await query({
					type: type as Type,
					host,
					port,
					maxAttempts: 5
				});

				if (typeof response.players === "number") {
					return response?.players;
				} else {
					return response?.players?.length;
				}
			}
		}
	}
};

export default GameCounter;
