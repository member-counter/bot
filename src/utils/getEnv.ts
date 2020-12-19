import dotenv from 'dotenv';
import dotenvParseVariables from 'dotenv-parse-variables';

interface MemberCounterEnv {
	readonly NODE_ENV: 'development' | 'production';
	readonly DEBUG: boolean;
	readonly UNRESTRICTED_MODE: boolean;
	readonly PORT: number;
	readonly AGENDA_ENABLED_JOBS: string[];
	readonly GHOST_MODE: boolean;

	readonly DISTRIBUTED: boolean;
	readonly FIRST_SHARD: number;
	readonly SHARD_AMOUNT: number;
	readonly TOTAL_SHARDS: number;

	readonly REDIS_LOCK_KEY: string;
	readonly REDIS_PASSWORD: string;
	readonly REDIS_HOST: string;
	readonly REDIS_PORT: number;

	readonly DB_URI: string;

	readonly STATUS_WEBHOOK_ID: string;
	readonly STATUS_WEBHOOK_TOKEN: string;

	readonly DISCORD_CLIENT_ID: string;
	readonly DISCORD_CLIENT_TOKEN: string;
	readonly DISCORD_BOT_INVITE: string;
	readonly DISCORD_PREFIX: string;
	readonly DISCORD_DEFAULT_LANG: string;
	readonly DISCORD_OFFICIAL_SERVER_ID: string;
	readonly DISCORD_OFFICIAL_SERVER_URL: string;

	readonly BOT_OWNERS: string[];

	readonly MEMBER_COUNTS_CACHE_CHECK: number;
	readonly MEMBER_COUNTS_CACHE_CHECK_SLEEP: number;
	readonly MEMBER_COUNTS_CACHE_LIFETIME: number;

	readonly PREMIUM_BOT: boolean;
	readonly PREMIUM_BOT_ID: string;
	readonly PREMIUM_BOT_INVITE: string;

	readonly WEBSITE_URL: string;
	readonly DONATION_URL: string;

	readonly MEMERATOR_API_KEY: string;

	readonly YOUTUBE_API_KEY: string;

	readonly TWITCH_CLIENT_ID: string;
	readonly TWITCH_CLIENT_SECRET: string;

	readonly TWITTER_CONSUMER_KEY: string;
	readonly TWITTER_CONSUMER_SECRET: string;
	readonly TWITTER_ACCESS_TOKEN: string;
	readonly TWITTER_ACCESS_TOKEN_SECRET: string;

	// Bot stats
	readonly SEND_BOT_STATS: boolean;
	readonly DBL_TOKEN: string;
	readonly DBGG_TOKEN: string;
	readonly DBOATS_TOKEN: string;
	readonly DBWORLD_TOKEN: string;
	readonly BOND_TOKEN: string;
	readonly BFD_TOKEN: string;
}


dotenv.config();

const parsedEnv = dotenvParseVariables({
	...process.env,
	DISCORD_CLIENT_ID: Buffer.from(process.env.DISCORD_CLIENT_TOKEN.split(".")[0], 'base64').toString("utf-8") + "*"
});

function getEnv(): MemberCounterEnv {
  return parsedEnv;
}

export default getEnv;
