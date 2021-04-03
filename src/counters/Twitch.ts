import { ApiClient, ClientCredentialsAuthProvider } from "twitch";
import getEnv from "../utils/getEnv";
import Counter from "../typings/Counter";

const { TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET } = getEnv();

const authProvider = new ClientCredentialsAuthProvider(
	TWITCH_CLIENT_ID,
	TWITCH_CLIENT_SECRET
);

const client = new ApiClient({ authProvider });

const TwitchCounter: Counter = {
	aliases: ["twitchFollowers", "twitchViews", "twitchChannelName"],
	isPremium: true,
	isEnabled: true,
	lifetime: 60 * 60 * 1000,
	execute: async ({ guild, resource: userName }) => {
		if (!TWITCH_CLIENT_ID) throw new Error("TWITCH_CLIENT_ID not provided");
		const user = await client.kraken.users.getUserByName(userName);
		const {
			followers,
			views,
			displayName
		} = await client.kraken.channels.getChannel(user);
		return {
			twitchFollowers: followers,
			twitchViews: views,
			twitchChannelName: displayName
		};
	}
};

export default TwitchCounter;
