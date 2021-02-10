import fetch from "node-fetch";
import AbortController from "abort-controller";
import * as packageJSON from "../../package.json";
import timeoutFetch from "../utils/timeoutFetch";
import Counter from "../typings/Counter";
import jsonBodyExtractor from "../utils/jsonBodyExtractor";
import getEnv from "../utils/getEnv";

const { COUNTER_HTTP_DENY_LIST } = getEnv();

interface Resource {
	url: string;
	parseNumber: boolean;
	dataPath: string;
}

const HTTPCounter: Counter = {
	aliases: ["http", "https", "http-string", "https-string"],
	isPremium: false,
	isEnabled: true,
	lifetime: 1 * 60 * 1000,
	execute: async ({ resource, aliasUsed }) => {
		const { url, parseNumber, dataPath }: Resource = JSON.parse(
			Buffer.from(resource, "base64").toString("utf-8")
		);

		if (!url) throw new Error("You didn't specify a url property");
		if (COUNTER_HTTP_DENY_LIST?.includes(new URL(url).hostname)) throw new Error("You can't make requests to this url!");
	
		console.log(url, parseInt, dataPath);

		let body: string;
		let result: number | string;

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

		body = await response.text();

		let responseContentType = response.headers.get("Content-Type");
		if (responseContentType.includes("text/plain")) {
			result = body;
		} else if (responseContentType.includes("application/json")) {
			if (!dataPath)
				throw new Error(
					"This resource returns a json body, you must specify a valid path to get the value"
				);
			result = jsonBodyExtractor(JSON.parse(body), dataPath);
		} else {
			throw new Error("Content type is not application/json or text/plain");
		}

		if (parseNumber === true) {
			result = Number(result);
		}

		return result;
	}
};

export default HTTPCounter;
