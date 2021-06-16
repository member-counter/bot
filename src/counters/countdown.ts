import Counter from "../typings/Counter";
import Constants from "../utils/Constants";

const CountdownCounter: Counter = {
	aliases: ["countdown"],
	isPremium: false,
	isEnabled: true,
	lifetime: 0,
	execute: async ({ guild, unparsedArgs: resource, args }) => {
		const format = args[1] || "%d:%h:%m";
		const date = parseInt(args[0], 10) * 1000 || 0;
		let timeLeft = new Date(date - Date.now());
		if (date - Date.now() < 0) timeLeft = new Date(0);

		const formated = format
			.replace(
				/%d/gi,
				`${Math.floor(timeLeft.getTime() / 1000 / 60 / 60 / 24)}`
			)
			.replace(/%h/gi, `${timeLeft.getUTCHours()}`)
			.replace(/%m/gi, `${timeLeft.getUTCMinutes()}`)
			.replace(/%s/gi, `${timeLeft.getUTCSeconds()}`);

		return formated;
	}
};

export default CountdownCounter;
