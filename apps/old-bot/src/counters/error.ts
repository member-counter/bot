import Counter from "../typings/Counter";
import getEnv from "../utils/getEnv";

const { NODE_ENV } = getEnv();

const ErrorCounter: Counter = {
	aliases: ["error"],
	isPremium: false,
	isEnabled: NODE_ENV === "development",
	lifetime: 0,
	execute: async () => {
		throw new Error("Error!!!");
	}
};

export default ErrorCounter;
