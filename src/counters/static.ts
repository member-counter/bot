import Counter from "../typings/Counter";

const StaticCounter: Counter = {
	aliases: ["static"],
	isPremium: false,
	isEnabled: true,
	lifetime: 0,
	execute: async ({ unparsedArgs: resource }) => {
		const intResource = Number(resource);
		if (isNaN(intResource)) return resource;
		else return intResource;
	}
};

export default StaticCounter;
