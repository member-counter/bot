import config from "../config";
import Counter from "../typings/Counter";
const TestCounter: Counter<"test"> = {
	aliases: ["test"],
	isPremium: false,
	isEnabled: config.env === "development",
	lifetime: 0,
	execute: async () => {
		return 1234567890;
		// return "Working!";
		// return { myCounter: Date.now(), myRandomCounter: "Working!" };
		// return Constants.CounterResult.ERROR;
		// return 1337;
	}
} as const;

export default TestCounter;
