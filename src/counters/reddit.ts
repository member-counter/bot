import Counter from "../typings/Counter";
import fetch from "node-fetch";
const reddit: Counter = {
	aliases: ["redditMembers", "redditMembersOnline", "redditTitle"],
	isPremium: false,
	isEnabled: true,
	lifetime: 0,
	execute: async ({ guild, resource: subreddit }) => {
		const response = await fetch(
			`https://www.reddit.com/r/${subreddit}/about.json`
		).then((response) => response.json());
		const {
			subscribers: subredditMembers,
			active_user_count: subredditMembersOnline,
			title: subredditTitle
		} = response?.data || {};
		return {
			redditMembers: Number(subredditMembers),
			redditMembersOnline: Number(subredditMembersOnline),
			redditTitle: subredditTitle.trim()
		};
	}
};

export default reddit;
