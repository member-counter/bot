import fetch from "node-fetch";
import AbortController from "abort-controller";
import * as packageJSON from "../../package.json";
import timeoutFetch from "../utils/timeoutFetch";

import Counter from "../typings/Counter";
import Constants from "../utils/Constants";

const HTTPStringCounter: Counter = {
	aliases: ["http-string", "https-string"],
	isPremium: false,
	isEnabled: true,
	lifetime: 1 * 60 * 1000,
	execute: async ({ guild, resource }) => {
		const controller = new AbortController();
		const response = await timeoutFetch(
			10000,
			fetch(resource, {
				signal: controller.signal,
				headers: {
					"User-Agent": `Member Counter Discord Bot/${packageJSON.version}`,
					Accept: "text/plain"
				}
			}),
			controller
		);

		if (
			response.status === 200 &&
			response.headers.get("Content-Type").includes("text/plain")
		) {
			return (await response.text()).trim();
		} else {
			controller.abort();
			throw new Error(`Invalid status code (not 200) in: ${resource}`);
		}
	}
};

export default HTTPStringCounter;
