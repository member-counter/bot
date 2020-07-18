import getEnv from '../utils/getEnv';
import fetch from 'node-fetch';
const { YOUTUBE_API_KEY } = getEnv();

import Counter from '../typings/Counter';
import Constants from '../utils/Constants';

const anyChannelMatch = /^((http|https):\/\/|)(www\.|m\.)youtube\.com\/(channel\/|user\/)/;
const userChannelMatch = /^((http|https):\/\/|)(www\.|m\.)youtube\.com\/user\//;
const userNameChannelMatch = /^((http|https):\/\/|)(www\.|m\.)youtube\.com\/channel\//;

const YouTubeCounter: Counter = {
	aliases: ['youtubeSubscribers', 'youtubeViews'],
	isPremium: true,
	isEnabled: true,
	lifetime: 60 * 60 * 1000,
	execute: async ({ guild, resource: channelUrl }) => {
		let channel = channelUrl.replace(anyChannelMatch, '');
		let searchChannelBy = '';

		if (userChannelMatch.test(channelUrl)) {
			searchChannelBy = 'forUsername';
		} else if (userNameChannelMatch.test(channelUrl)) {
			searchChannelBy = 'id';
		} else {
			throw new Error(`Invalid youtube channel url: ${channelUrl}`);
		}

		const response = await fetch(
			`https://www.googleapis.com/youtube/v3/channels?part=statistics&key=${YOUTUBE_API_KEY}&${searchChannelBy}=${channel}`,
		).then((response) => response.json());

		const subscribers = response?.items?.[0]?.statistics?.subscriberCount;
		const views = response?.items?.[0]?.statistics?.viewCount;
		return { youtubeSubscribers: subscribers, youtubeViews: views };
	},
};

export default YouTubeCounter;
