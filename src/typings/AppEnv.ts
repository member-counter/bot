interface _AppEnv {
	NODE_ENV: "development" | "production";
	DEBUG: boolean;
	UNRESTRICTED_MODE: boolean;
	PORT: number;
	GHOST_MODE: boolean;

	DISTRIBUTED: boolean;
	FIRST_SHARD: number;
	SHARD_AMOUNT: number;
	TOTAL_SHARDS: number;

	REDIS_LOCK_KEY: string;
	REDIS_PASSWORD: string;
	REDIS_HOST: string;
	REDIS_PORT: number;

	DB_URI: string;

	STATUS_WEBHOOK_ID: string;
	STATUS_WEBHOOK_TOKEN: string;

	DISCORD_CLIENT_ID: string;
	DISCORD_CLIENT_TOKEN: string;
	DISCORD_BOT_INVITE: string;
	DISCORD_PREFIX: string;
	DISCORD_DEFAULT_LANG: string;
	DISCORD_OFFICIAL_SERVER_ID: string;
	DISCORD_OFFICIAL_SERVER_URL: string;

	DISCORD_STATUS: string[];

	BOT_COLOR: number;

	BOT_OWNERS: string[];

	MEMBER_COUNTS_CACHE_LIFETIME: number;
	MEMBER_COUNTS_CACHE_CHECK_SLEEP: number;
	MEMBER_COUNTS_BURST_RATE: number;

	PREMIUM_BOT: boolean;
	PREMIUM_BOT_ID: string;
	PREMIUM_BOT_INVITE: string;

	UPDATE_COUNTER_INTERVAL: string;

	// Custom Emojis

	// Paginator
	USE_CUSTOM_EMOJIS: boolean;
	CUSTOM_EMOJI_FIRST_PAGE: string;
	CUSTOM_EMOJI_LAST_PAGE: string;
	CUSTOM_EMOJI_PREVIOUS_PAGE: string;
	CUSTOM_EMOJI_NEXT_PAGE: string;
	CUSTOM_EMOJI_JUMP: string;

	// Setup command1
	CUSTOM_EMOJI_LOADING: string;
	CUSTOM_EMOJI_CHECK_MARK: string;
	CUSTOM_EMOJI_ERROR: string;

	// Custom emojis for general use
	CUSTOM_EMOJI_CONFIRM: string;
	CUSTOM_EMOJI_NEGATIVE: string;
	CUSTOM_EMOJI_WARNING: string;

	// URLs
	WEBSITE_URL: string;
	GET_PREMIUM_BOT_URL: string;
	MOTD_URL: string;

	MEMERATOR_API_KEY: string;

	// API Credentials
	YOUTUBE_API_KEY: string;

	TWITCH_CLIENT_ID: string;
	TWITCH_CLIENT_SECRET: string;

	TWITTER_CONSUMER_KEY: string;
	TWITTER_CONSUMER_SECRET: string;
	TWITTER_ACCESS_TOKEN: string;
	TWITTER_ACCESS_TOKEN_SECRET: string;

	// Bot stats
	SEND_BOT_STATS: boolean;
	DBL_TOKEN: string;
	DBGG_TOKEN: string;
	DBOATS_TOKEN: string;
	BOND_TOKEN: string;
	BFD_TOKEN: string;

	COUNTER_HTTP_DENY_LIST: string[];
}

// set all properties to readonly
interface AppEnv extends Readonly<_AppEnv> {}

export default AppEnv;
