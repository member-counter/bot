import AbortController from "abort-controller";
import fetch from "node-fetch";

import * as packageJSON from "../../package.json";
import config from "../config";
import logger from "../logger";
import redis from "../redis";

import jsonBodyExtractor from "../utils/jsonBodyExtractor";
import timeoutFetch from "../utils/timeoutFetch";

const { counterHTTPDenyList } = config;
interface Resource {
	url: string;
	parseNumber: boolean;
	dataPath: string;
	lifetime: number;
}

import Counter from "../typings/Counter";
const HTTPCounter: Counter<"http" | "https" | "http-string" | "https-string"> =
	{
		aliases: ["http", "https", "http-string", "https-string"],
		isPremium: false,
		isEnabled: true,
		lifetime: 0,
		execute: async ({ args }) => {
			const { url, parseNumber, dataPath, lifetime }: Resource = JSON.parse(
				Buffer.from(args[0][0], "base64").toString("utf-8")
			);

			if (!url) throw new Error("You didn't specify a url property");
			if (counterHTTPDenyList?.includes(new URL(url).hostname))
				throw new Error("You can't make requests to this url!");

			let result: number | string;
			const cachedResponse = await redis.get(url);

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
					.catch(logger.error);

				const responseContentType = response.headers.get("Content-Type");
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
	} as const;

export default HTTPCounter;
