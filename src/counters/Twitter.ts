import Counter from "../typings/Counter";

import getEnv from "../utils/getEnv";
import Twitter from "twitter";

const {
	TWITTER_CONSUMER_KEY,
	TWITTER_CONSUMER_SECRET,
	TWITTER_ACCESS_TOKEN,
	TWITTER_ACCESS_TOKEN_SECRET
} = getEnv();

const twitterClient = new Twitter({
	consumer_key: TWITTER_CONSUMER_KEY,
	consumer_secret: TWITTER_CONSUMER_SECRET,
	access_token_key: TWITTER_ACCESS_TOKEN,
	access_token_secret: TWITTER_ACCESS_TOKEN_SECRET
});

const TwitterCounter: Counter = {
	aliases: ["twitterFollowers", "twitterName"],
	isPremium: true,
	isEnabled: false,
	lifetime: 5 * 60 * 1000,
	execute: async ({ unparsedArgs: resource }) => {
		if (!TWITTER_ACCESS_TOKEN)
			throw new Error("TWITTER_ACCESS_TOKEN not provided");
		const count = await twitterClient.get("users/show", {
			screen_name: resource
		});

		return { twitterFollowers: count?.followers_count, twitterName: resource };
	}
};

export default TwitterCounter;
