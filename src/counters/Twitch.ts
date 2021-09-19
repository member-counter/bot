import { ApiClient } from "@twurple/api";
import { ClientCredentialsAuthProvider } from "@twurple/auth";
import getEnv from "../utils/getEnv";
import Counter from "../typings/Counter";

const { TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET } = getEnv();

const authProvider = new ClientCredentialsAuthProvider(
	TWITCH_CLIENT_ID,
	TWITCH_CLIENT_SECRET,
);

const client = new ApiClient({ authProvider });

const TwitchCounter: Counter = {
	aliases: ["twitchFollowers", "twitchViews", "twitchChannelName"],
	isPremium: true,
	isEnabled: true,
	lifetime: 60 * 60 * 1000,
	execute: async ({ guild, unparsedArgs: userName }) => {
		try {
			if (!TWITCH_CLIENT_ID) throw new Error("TWITCH_CLIENT_ID not provided");
			if (!TWITCH_CLIENT_SECRET)
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
			console.error(e);
		}
	}
};

export default TwitchCounter;
