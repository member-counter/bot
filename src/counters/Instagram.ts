import Counter from "../typings/Counter";
import fetch from "node-fetch";

const InstagramCounter: Counter = {
	aliases: ['instagramFollowers'],
	isPremium: true,
	isEnabled: true,
	lifetime: 60 * 60 * 1000,
	execute: async ({ client, guild, guildSettings, resource }) => {
		const response = await fetch(
			`https://www.instagram.com/${resource}/?__a=1`,
		).then((response) => response.json());

		return response?.graphql?.user?.edge_follow?.count
	}
}

export default InstagramCounter;