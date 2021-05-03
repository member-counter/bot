import Counter from "../typings/Counter";
import fetch from "node-fetch";
const redditMembers: Counter = {
	aliases: ["redditMembers", "redditSubscribers"],
	isPremium: false,
	isEnabled: true,
	lifetime: 0,
	execute: async ({ guild, resource: subreddit }) => {
		const response = await fetch(
			`https://www.reddit.com/r/${subreddit}/about.json`
		).then((response) => response.json());
		const subredditMembers = response?.data?.subscribers || {};
		return subredditMembers;
	}
};

export default redditMembers;
