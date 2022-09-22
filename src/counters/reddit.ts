import fetch from "node-fetch";
import Counter from "../typings/Counter";
const reddit: Counter<"redditMembers" | "redditMembersOnline" | "redditTitle"> =
	{
		aliases: ["redditMembers", "redditMembersOnline", "redditTitle"],
		isPremium: false,
		isEnabled: true,
		lifetime: 0,
		execute: async ({ unparsedArgs: subreddit }) => {
			const response: {
				data?: {
					subscribers: number;
					active_user_count: number;
					title: string;
				};
			} = await fetch(`https://www.reddit.com/r/${subreddit}/about.json`).then(
				(response) => response.json()
			);
			const {
				subscribers: subredditMembers,
				active_user_count: subredditMembersOnline,
				title: subredditTitle
			} = response?.data || ({} as const);
			return {
				redditMembers: Number(subredditMembers),
				redditMembersOnline: Number(subredditMembersOnline),
				redditTitle: subredditTitle.trim()
			} as const;
		}
	} as const;

export default reddit;
