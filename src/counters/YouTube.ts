import config from "../config";

const { youtubeApiKey } = config;
import fetch from "node-fetch";

import Counter from "../typings/Counter";

const anyChannelMatch =
	/^((http|https):\/\/|)(www\.|m\.)?youtube\.com\/(channel|user|c)\//;
const usernameChannelMatch =
	/^((http|https):\/\/|)(www\.|m\.)?youtube\.com\/(user|c)\//;
const idChannelMatch =
	/^((http|https):\/\/|)(www\.|m\.)?youtube\.com\/channel\//;

const YouTubeCounter: Counter<
	"youtubeSubscribers" | "youtubeViews" | "youtubeVideos" | "youtubeChannelName"
> = {
	aliases: [
		"youtubeSubscribers",
		"youtubeViews",
		"youtubeVideos",
		"youtubeChannelName"
	],
	isPremium: true,
	isEnabled: true,
	lifetime: 60 * 60 * 1000,
	execute: async ({ unparsedArgs: channelUrl }) => {
		if (!youtubeApiKey) throw new Error("YOUTUBE_API_KEY not provided");
		const channel = channelUrl.replace(anyChannelMatch, "");
		let searchChannelBy = "";

		if (usernameChannelMatch.test(channelUrl)) {
			searchChannelBy = "forUsername";
		} else if (idChannelMatch.test(channelUrl)) {
			searchChannelBy = "id";
		} else {
			throw new Error(`Invalid youtube channel url: ${channelUrl}`);
		}

		const response: {
			items?: {
				snippet?: { title: string };
				statistics: {
					subscriberCount: string;
					viewCount: string;
					videoCount: string;
				};
			}[];
		} = await fetch(
			`https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&key=${youtubeApiKey}&${searchChannelBy}=${channel}`
		).then((response) => response.json());

		const { subscriberCount, viewCount, videoCount } =
			response?.items?.[0]?.statistics || {};
		const { title: youtubeChannelName } = response?.items?.[0]?.snippet || {};
		return {
			youtubeSubscribers: Number(subscriberCount),
			youtubeViews: Number(viewCount),
			youtubeVideos: Number(videoCount),
			youtubeChannelName
		};
	}
};

export default YouTubeCounter;
