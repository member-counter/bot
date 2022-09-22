import Redis from "ioredis";
import config from "./config";
const {
	redis: { host, password, port }
} = config;

export const redis = new Redis({
	port: port,
	host: host,
	family: 4,
	password: password,
	lazyConnect: true
});

export default redis;
