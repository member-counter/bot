import Counter from "../typings/Counter";
const StaticCounter: Counter<"static"> = {
	aliases: ["static"],
	isPremium: false,
	isEnabled: true,
	lifetime: 0,
	execute: async ({ unparsedArgs: resource }) => {
		const intResource = Number(resource);
		if (isNaN(intResource)) return resource;
		else return intResource;
	}
} as const;

export default StaticCounter;
