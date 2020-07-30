import twitch from 'twitch';
import getEnv from '../utils/getEnv';
import Counter from '../typings/Counter';
import Constants from '../utils/Constants';

const { TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET } = getEnv();

const client = twitch.withClientCredentials(
	TWITCH_CLIENT_ID,
	TWITCH_CLIENT_SECRET,
);

const TwitchCounter: Counter = {
	aliases: ['twitchFollowers', 'twitchViews'],
	isPremium: true,
	isEnabled: true,
	lifetime: 60 * 60 * 1000,
	execute: async ({ guild, resource: userName }) => {
		const user = await client.kraken.users.getUserByName(userName);
		const { followers, views } = await client.kraken.channels.getChannel(
			user,
		);
		return { twitchFollowers: followers, twitchViews: views };
	},
};

export default TwitchCounter;
