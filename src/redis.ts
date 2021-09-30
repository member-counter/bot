import Redis from "ioredis";
import getEnv from "./utils/getEnv";

const { REDIS_HOST, REDIS_PASSWORD, REDIS_PORT } = getEnv();

export const redis = new Redis({
	port: REDIS_PORT,
	host: REDIS_HOST,
	family: 4,
	password: REDIS_PASSWORD,
	lazyConnect: true
});

export default redis;
