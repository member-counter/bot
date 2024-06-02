import fetch from "node-fetch";

import Counter from "../typings/Counter";
const InstagramCounter: Counter<"instagramFollowers"> = {
	aliases: ["instagramFollowers"],
	isPremium: true,
	isEnabled: true,
	lifetime: 60 * 60 * 1000,
	execute: async ({ unparsedArgs: resource }) => {
		const response: {
			graphql?: {
				user?: {
					edge_followed_by?: {
						count: number;
					};
				};
			};
		} = await fetch(`https://www.instagram.com/${resource}/?__a=1`).then(
			(response) => response.json()
		);

		return response?.graphql?.user?.edge_followed_by?.count;
	}
} as const;

export default InstagramCounter;
