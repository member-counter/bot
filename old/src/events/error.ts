import getEnv from "../utils/getEnv";

const { DISCORD_CLIENT_ID } = getEnv();

const error = (error, shardId) => {
	// @ts-ignore typings don't include .code
	if (error.code === 4014) {
		console.error(
			`FATAL ERROR! NECESSARY INTENTS DISABLED - PLEASE VISIT https://discord.com/developers/applications/${DISCORD_CLIENT_ID}/bot AND ENABLE THE PRIVILEGED INTENTS`
		);
		process.exit(1);
	} else {
		console.error(error, shardId);
	}
};

export default error;
