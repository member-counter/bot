import Counter from "../typings/Counter";
const ReplaceCounter: Counter<"replace"> = {
	aliases: ["replace"],
	isPremium: false,
	isEnabled: true,
	lifetime: 0,
	execute: async ({ args }) => {
		const [[text], unparsedPairs] = args;

		const pairs = unparsedPairs.map((pair) => pair.split(/(?<!\\);/));

		let newText = text;

		for (const pair of pairs) {
			const [oldValue, newValue] = pair;
			newText = newText.replaceAll(oldValue, newValue);
		}

		return newText;
	}
} as const;

export default ReplaceCounter;
