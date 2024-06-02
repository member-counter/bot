import fetch from "node-fetch";
import Counter from "../typings/Counter";
import config from "../config";
const { memeratorApiKey } = config;
const MemeratorCounter: Counter<"memeratorFollowers" | "memeratorMemes"> = {
	aliases: ["memeratorFollowers", "memeratorMemes"],
	isPremium: false,
	isEnabled: true,
	lifetime: 30 * 60 * 1000,

	execute: async ({ unparsedArgs: resource }) => {
		if (!memeratorApiKey) throw new Error("MEMERATOR_API_KEY not provided");
		const response: {
			stats?: {
				followers: number;
				memes: number;
			};
		} = await fetch(`https://api.memerator.me/v1/profile/${resource}`, {
			headers: { Authorization: memeratorApiKey }
		}).then((response) => response.json());

		return {
			memeratorFollowers: response?.stats?.followers,
			memeratorMemes: response?.stats?.memes
		};
	}
};

export default MemeratorCounter;
