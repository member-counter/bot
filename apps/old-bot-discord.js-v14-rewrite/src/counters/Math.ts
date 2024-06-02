import Counter from "../typings/Counter";

const Math: Counter<
	| "add"
	| "sum"
	| "sub"
	| "subtract"
	| "mult"
	| "multiply"
	| "div"
	| "divide"
	| "mod"
	| "modulus"
> = {
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
				return values.reduce((acc, curr) => acc + curr);
			case "sub":
			case "subtract":
				return values.reduce((acc, curr) => {
					return acc - curr;
				});
			case "mult":
			case "multiply":
				return values.reduce((acc, curr) => acc * curr);
			case "div":
			case "divide":
				return values.reduce((acc, curr) => acc / curr);

			case "mod":
			case "modulus":
				return values.reduce((acc, curr) => acc % curr);

			default:
				break;
		}
	}
} as const;

export default Math;
