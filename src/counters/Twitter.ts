import Counter from "../typings/Counter";
import Twitter from "twitter";

import config from "../config";

const {
	twitterConsumerKey,
	twitterConsumerSecret,
	twitterAccessToken,
	twitterAccessTokenSecret
} = config;

const twitterClient = new Twitter({
	consumer_key: twitterConsumerKey,
	consumer_secret: twitterConsumerSecret,
	access_token_key: twitterAccessToken,
	access_token_secret: twitterAccessTokenSecret
});

const TwitterCounter: Counter<"twitterFollowers" | "twitterName"> = {
	aliases: ["twitterFollowers", "twitterName"],
	isPremium: true,
	isEnabled: true,
	lifetime: 5 * 60 * 1000,
	execute: async ({ unparsedArgs: resource }) => {
		if (!twitterAccessToken)
			throw new Error("TWITTER_ACCESS_TOKEN not provided");
		const count = await twitterClient.get("users/show", {
			screen_name: resource
		});

		return { twitterFollowers: count?.followers_count, twitterName: resource };
	}
};

export default TwitterCounter;
