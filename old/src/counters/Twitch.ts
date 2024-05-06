import { ApiClient } from "@twurple/api";
import { AppTokenAuthProvider } from "@twurple/auth";
import getEnv from "../utils/getEnv";
import Counter from "../typings/Counter";

const { TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET } = getEnv();

const authProvider = new AppTokenAuthProvider(
	TWITCH_CLIENT_ID,
	TWITCH_CLIENT_SECRET
);

const client = new ApiClient({ authProvider });

const TwitchCounter: Counter = {
	aliases: ["twitchFollowers", "twitchViewers", "twitchChannelName"],
	isPremium: true,
	isEnabled: true,
	lifetime: 60 * 60 * 1000,
	execute: async ({ unparsedArgs: userName }) => {
		try {
			if (!TWITCH_CLIENT_ID) throw new Error("TWITCH_CLIENT_ID not provided");
			if (!TWITCH_CLIENT_SECRET) throw new Error("TWITCH_CLIENT_SECRET not provided");

			const channel = await client.users.getUserByName(userName);
			if (!channel) {
				return {
					twitchFollowers: "User Not Found",
					twitchViewers: "User Not Found",
					twitchChannelName: "User Not Found"
				};
			}
			const { displayName } = channel;
			const stream = await client.streams.getStreamByUserName(userName);
			let viewers = "Offline";
			if (stream !== null) {
				viewers = stream.viewers.toString();
			}
			const followers = await client.channels.getChannelFollowerCount(channel.id);

			return {
				twitchFollowers: followers,
				twitchViewers: viewers,
				twitchChannelName: displayName
			};
		} catch (e) {
			console.error(e);
		}
	}
};

export default TwitchCounter;
