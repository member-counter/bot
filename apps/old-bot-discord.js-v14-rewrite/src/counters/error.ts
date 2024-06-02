import config from "../config";

import Counter from "../typings/Counter";
const ErrorCounter: Counter<"error"> = {
	aliases: ["error"],
	isPremium: false,
	isEnabled: config.env === "development",
	lifetime: 0,
	execute: async () => {
		throw new Error("Error!!!");
	}
} as const;

export default ErrorCounter;
