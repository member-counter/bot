import Counter from "../typings/Counter";

const Math: Counter = {
	aliases: [
		"add",
		"sum",
		"sub",
		"subtract",
		"mult",
		"multiply",
		"div",
		"divide",
		"mod",
		"modulus"
	],
	isPremium: false,
	isEnabled: true,
	lifetime: 0,
	execute: async ({ args, aliasUsed }) => {
		const values = args[0]?.map((n) => Number(n));

		switch (aliasUsed) {
			case "add":
			case "sum":
				return values.reduce((accu, curr) => accu + curr);
			case "sub":
			case "subtract":
				return values.reduce((accu, curr) => {
					return accu - curr;
				});
			case "mult":
			case "multiply":
				return values.reduce((accu, curr) => accu * curr);
			case "div":
			case "divide":
				return values.reduce((accu, curr) => accu / curr);

			case "mod":
			case "modulus":
				return values.reduce((accu, curr) => accu % curr);

			default:
				break;
		}
	}
};

export default Math;
