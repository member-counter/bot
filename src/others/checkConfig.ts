import getEnv from "../utils/getEnv";
import { availableLanguagePacks } from "../utils/languagePack";

const {
	DISCORD_CLIENT_TOKEN,
	UNRESTRICTED_MODE,
	GHOST_MODE,
	DISCORD_PREFIX,
	DISCORD_DEFAULT_LANG,
	BOT_COLOR,
	PREMIUM_BOT,
	UPDATE_COUNTER_INTERVAL,
	DB_URI,
	REDIS_HOST,
	REDIS_PORT,
	REDIS_PASSWORD,
	TWITCH_CLIENT_ID,
	TWITCH_CLIENT_SECRET,
	TWITTER_CONSUMER_KEY,
	TWITTER_CONSUMER_SECRET,
	TWITTER_ACCESS_TOKEN,
	TWITTER_ACCESS_TOKEN_SECRET
} = getEnv();

// check if the bot will work correctly with the current settings
function checkConfig() {
	let fail = false;

	// check token
	if (
		!DISCORD_CLIENT_TOKEN ||
		DISCORD_CLIENT_TOKEN.split(".").length !== 3 ||
		isNaN(
			Number(
				Buffer.from(DISCORD_CLIENT_TOKEN.split(".")[0], "base64").toString()
			)
		)
	) {
		console.error("[ENV ERROR] Invalid bot token format");
		fail = true;
	}

	if (typeof UPDATE_COUNTER_INTERVAL !== "string") {
		console.error(
			`[ENV ERROR] The current UPDATE_COUNTER_INTERVAL "${UPDATE_COUNTER_INTERVAL}" is invalid, if you wanna use the lowest possible interval, set this env var to \`0 */5 * * * *\``
		);
		fail = true;
	}

	if (!DB_URI) {
		console.error(`[ENV ERROR] The current DB_URI is empty`);
		fail = true;
	}

	if (!REDIS_HOST) {
		console.error(`[ENV ERROR] The current REDIS_HOST is empty`);
		fail = true;
	}
	if (isNaN(Number(REDIS_PORT))) {
		console.error(
			`[ENV ERROR] The current REDIS_PORT ${REDIS_PORT} is not a valid port`
		);
		fail = true;
	}
	if (!REDIS_PASSWORD) {
		console.error(
			`[ENV ERROR] The current REDIS_PASSWORD is empty, you must set a password`
		);
		fail = true;
	}

	if (!UNRESTRICTED_MODE)
		console.warn(
			"[ENV WARN] UNRESTRICTED_MODE is set to false, some counters won't be available"
		);
	if (!PREMIUM_BOT)
		console.warn(
			"[ENV WARN] PREMIUM_BOT is set to false, some counters won't be available"
		);
	if (GHOST_MODE)
		console.warn(
			"[ENV WARN] GHOST_MODE is set to true, counters won't be updated and commands won't work!"
		);

	if (typeof DISCORD_PREFIX !== "string") {
		console.error(
			`[ENV ERROR] The current prefix "${DISCORD_PREFIX}" is invalid`
		);
		fail = true;
	}

	if (BOT_COLOR?.toString().length && typeof BOT_COLOR !== "number") {
		console.error(
			`[ENV ERROR] The current BOT_COLOR "${BOT_COLOR}" is invalid`
		);
		fail = true;
	}

	if (!availableLanguagePacks.includes(DISCORD_DEFAULT_LANG)) {
		console.error(
			`[ENV ERROR] The current language code "${DISCORD_DEFAULT_LANG}" is invalid`
		);
		fail = true;
	}

	const twitchCredentialsCheck = [TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET];
	const twitchCredentialsCheckNull = twitchCredentialsCheck.filter((x) => x);
	if (
		twitchCredentialsCheckNull.length &&
		twitchCredentialsCheck.length !== twitchCredentialsCheckNull.length
	) {
		console.error(
			`[ENV ERROR] TWITCH_CLIENT_ID or TWITCH_CLIENT_SECRET is/are empty, empty the vars or fill out all`
		);
		fail = true;
	}

	const twitterCredentialsCheck = [
		TWITTER_CONSUMER_KEY,
		TWITTER_CONSUMER_SECRET,
		TWITTER_ACCESS_TOKEN,
		TWITTER_ACCESS_TOKEN_SECRET
	];
	const twitterCredentialsCheckNull = twitterCredentialsCheck.filter((x) => x);
	if (
		twitterCredentialsCheckNull.length &&
		twitterCredentialsCheck.length !== twitterCredentialsCheckNull.length
	) {
		console.error(
			`[ENV ERROR] TWITTER_CONSUMER_KEY or TWITTER_CONSUMER_SECRET or TWITTER_ACCESS_TOKEN or TWITTER_ACCESS_TOKEN_SECRET is/are empty, empty the vars or fill out all`
		);
		fail = true;
	}

	if (fail) {
		console.error("Some env vars are not properly configured, bot stopped");
		process.exit(1);
	}
}

export default checkConfig;
