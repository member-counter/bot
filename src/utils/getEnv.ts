import dotenv from "dotenv";
import dotenvParseVariables from "dotenv-parse-variables";
import AppEnv from "../typings/AppEnv";

// this will load a .env file into process.env
dotenv.config();

const parsedEnv = dotenvParseVariables({
	...process.env,
	DISCORD_CLIENT_ID:
		Buffer.from(
			process.env.DISCORD_CLIENT_TOKEN.split(".")[0],
			"base64"
		).toString("utf-8") + "*",
	// Since k8s doesn't offer any clean way to get the id of a pod in a statefulset, we must extract it from the pod's name
	FIRST_SHARD: Number(process.env.FIRST_SHARD?.match(/(\d+)/)[0])
});

// fix Env vars that are supposed to be an array (they aren't being parsed as arrays by dotenv-parse-variables because there are no commas sometimes)
const arrayEnvVars = [
	"DISCORD_STATUS",
	"COUNTER_HTTP_DENY_LIST",
	"BOT_OWNERS",
	"DISCORD_GUILDS"
];

arrayEnvVars.forEach((envVar) => {
	const value = parsedEnv[envVar];
	let newValue = null;

	if (Array.isArray(value)) {
		newValue = value;
	} else if (typeof value === "string") {
		newValue = [value];
	} else {
		newValue = [];
	}

	parsedEnv[envVar] = newValue;
});

function getEnv(): AppEnv {
	return parsedEnv;
}

export default getEnv;
