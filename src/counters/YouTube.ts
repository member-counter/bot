import getEnv from "../utils/getEnv";
import fetch from "node-fetch";
const { YOUTUBE_API_KEY } = getEnv();

import Counter from "../typings/Counter";

const anyChannelMatch = /^((http|https):\/\/|)(www\.|m\.)?youtube\.com\/(channel|user|c)\//;
const usernameChannelMatch = /^((http|https):\/\/|)(www\.|m\.)?youtube\.com\/(user|c)\//;
const idChannelMatch = /^((http|https):\/\/|)(www\.|m\.)?youtube\.com\/channel\//;

const YouTubeCounter: Counter = {
	aliases: [
		"youtubeSubscribers",
		"youtubeViews",
		"youtubeVideos",
		"youtubeChannelName"
	],
	isPremium: true,
	isEnabled: true,
	lifetime: 60 * 60 * 1000,
	execute: async ({ guild, unparsedArgs: channelUrl }) => {
		if (!YOUTUBE_API_KEY) throw new Error("YOUTUBE_API_KEY not provided");
		let channel = channelUrl.replace(anyChannelMatch, "");
		let searchChannelBy = "";

		if (usernameChannelMatch.test(channelUrl)) {
			searchChannelBy = "forUsername";
		} else if (idChannelMatch.test(channelUrl)) {
			searchChannelBy = "id";
		} else {
			throw new Error(`Invalid youtube channel url: ${channelUrl}`);
		}

		const response = await fetch(
			`https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&key=${YOUTUBE_API_KEY}&${searchChannelBy}=${channel}`
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
