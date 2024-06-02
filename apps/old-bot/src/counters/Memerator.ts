import fetch from "node-fetch";
import Counter from "../typings/Counter";
import getEnv from "../utils/getEnv";
const { MEMERATOR_API_KEY } = getEnv();

const MemeratorCounter: Counter = {
	aliases: ["memeratorFollowers", "memeratorMemes"],
	isPremium: false,
	isEnabled: true,
	lifetime: 30 * 60 * 1000,

	execute: async ({ unparsedArgs: resource }) => {
		if (!MEMERATOR_API_KEY) throw new Error("MEMERATOR_API_KEY not provided");
		const response = await fetch(
			`https://api.memerator.me/v1/profile/${resource}`,
			{ headers: { Authorization: MEMERATOR_API_KEY } }
		).then((response) => response.json());

		return {
			memeratorFollowers: response?.stats?.followers,
			memeratorMemes: response?.stats?.memes
		};
	}
};

export default MemeratorCounter;
