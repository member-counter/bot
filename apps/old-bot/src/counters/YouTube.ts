import getEnv from "../utils/getEnv";
import fetch from "node-fetch";
const { YOUTUBE_API_KEY } = getEnv();

import Counter from "../typings/Counter";

const legacyUsernameChannelMatch = /^((http|https):\/\/|)(www\.|m\.)?youtube\.com\/(user|c)\//;
const handleUsernameChannelMatch = /^((http|https):\/\/|)(www\.|m\.)?youtube\.com\/\@/;
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
	execute: async ({ unparsedArgs: channelUrl }) => {
		if (!YOUTUBE_API_KEY) throw new Error("YOUTUBE_API_KEY not provided");

		let channel = "";
		let searchChannelBy = "id";
	
		if (legacyUsernameChannelMatch.test(channelUrl)) {
			searchChannelBy = "forUsername";
			channel = channelUrl.replace(legacyUsernameChannelMatch, "");
		} else if (handleUsernameChannelMatch.test(channelUrl)) {
			const getId = await fetch(
				`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${channelUrl.replace(handleUsernameChannelMatch, "")}&type=channel&key=${YOUTUBE_API_KEY}`
			).then((response) => response.json());
			channel = getId.items?.[0]?.id.channelId;
		} else if (idChannelMatch.test(channelUrl)) {
			channel = channelUrl.replace(idChannelMatch, "")
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
