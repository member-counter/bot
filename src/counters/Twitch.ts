import { ApiClient } from "@twurple/api";
import { ClientCredentialsAuthProvider } from "@twurple/auth";

import config from "../config";
import logger from "../logger";
import Counter from "../typings/Counter";

const { twitchClientId, twitchClientSecret } = config;

const authProvider = new ClientCredentialsAuthProvider(
	twitchClientId,
	twitchClientSecret
);

const client = new ApiClient({ authProvider });

const TwitchCounter: Counter<
	"twitchFollowers" | "twitchViews" | "twitchChannelName"
> = {
	aliases: ["twitchFollowers", "twitchViews", "twitchChannelName"],
	isPremium: true,
	isEnabled: true,
	lifetime: 60 * 60 * 1000,
	execute: async ({ unparsedArgs: userName }) => {
		try {
			if (!twitchClientId) throw new Error("TWITCH_CLIENT_ID not provided");
			if (!twitchClientSecret)
				throw new Error("TWITCH_CLIENT_SECRET not provided");

			const user = await client.users.getUserByName(userName);
			const { views, displayName } = user;
			const followers = await client.users
				.getFollowsPaginated({ followedUser: user })
				.getTotalCount();

			return {
				twitchFollowers: followers,
				twitchViews: views,
				twitchChannelName: displayName
			};
		} catch (e) {
			logger.error(e);
		}
	}
};

export default TwitchCounter;
