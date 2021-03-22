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

function getEnv(): AppEnv {
	return parsedEnv;
}

export default getEnv;
