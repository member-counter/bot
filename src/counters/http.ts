import fetch from "node-fetch";
import AbortController from "abort-controller";
import * as packageJSON from "../../package.json";
import timeoutFetch from "../utils/timeoutFetch";
import Counter from "../typings/Counter";
import jsonBodyExtractor from "../utils/jsonBodyExtractor";
import getEnv from "../utils/getEnv";
import redis from "../redis";

const { COUNTER_HTTP_DENY_LIST } = getEnv();

interface Resource {
	url: string;
	parseNumber: boolean;
	dataPath: string;
	lifetime: number;
}

const HTTPCounter: Counter = {
	aliases: ["http", "https", "http-string", "https-string"],
	isPremium: false,
	isEnabled: true,
	lifetime: 0,
	execute: async ({ args }) => {
		const { url, parseNumber, dataPath, lifetime }: Resource = JSON.parse(
			Buffer.from(args[0][0], "base64").toString("utf-8")
		);

		if (!url) throw new Error("You didn't specify a url property");
		if (COUNTER_HTTP_DENY_LIST?.includes(new URL(url).hostname))
			throw new Error("You can't make requests to this url!");

		let result: number | string;
		let cachedResponse = await redis.get(url);

		if (!cachedResponse) {
			const controller = new AbortController();
			const response = await timeoutFetch(
				10000,
				fetch(url, {
					signal: controller.signal,
					headers: {
						"User-Agent": `Member Counter Discord Bot/${packageJSON.version}`
					}
				}),
				controller
			);

			if (response.status !== 200) {
				controller.abort();
				throw new Error("Invalid status code (not 200)");
			}

			result = await response.text();
			redis
				.set(url, result, "EX", lifetime ?? 1 * 60 * 60)
				.catch(console.error);

			let responseContentType = response.headers.get("Content-Type");
			if (responseContentType.includes("text/plain")) {
				// do nothing, just allow it
			} else if (responseContentType.includes("application/json")) {
				if (!dataPath)
					throw new Error(
						"This resource returns a json body, you must specify a valid path to get the value"
					);
			} else {
				throw new Error("Content type is not application/json or text/plain");
			}
		} else {
			result = cachedResponse;
		}

		if (dataPath) {
			try {
				result = jsonBodyExtractor(JSON.parse(result.toString()), dataPath);
			} catch {}
		}

		if (parseNumber === true) {
			result = Number(result);
		}

		return result;
	}
};

export default HTTPCounter;
