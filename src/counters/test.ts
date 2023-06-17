import Counter from "../typings/Counter";
import getEnv from "../utils/getEnv";

const { NODE_ENV } = getEnv();

const TestCounter: Counter = {
	aliases: ["test"],
	isPremium: false,
	isEnabled: NODE_ENV === "development",
	lifetime: 0,
	execute: async () => {
		return 1234567890;
		// return "Working!";
		// return { myCounter: Date.now(), myRandomCounter: "Working!" };
		// throw CounterError.UNKNOWN ;
		// return 1337;
	}
};

export default TestCounter;
