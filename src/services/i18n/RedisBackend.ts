import Redis from "ioredis";
import { availableLocales } from ".";
import config from "../../config";
import logger from "../../logger";

let redis: Redis.Redis;

if (config.i18n.provider === "redis") {
	redis = new Redis(config.redis.port, config.redis.host, {
		password: config.redis.password
	});
}

const maxLifetime = 1 * 60 * 1000;

export const RedisBackend = {
	redis: null,
	cache: {},
	cacheTime: {},
	type: "backend",
	read: async function (language, namespace, callback) {
		try {
			const resetLifetime = () => {
				clearTimeout(RedisBackend.cacheTime[language]);

				RedisBackend.cacheTime[language] = setTimeout(() => {
					RedisBackend.cache[language] = null;
					RedisBackend.cacheTime[language] = null;
				}, maxLifetime);
			};

			if (RedisBackend.cache[language]) {
				resetLifetime();

				callback(null, RedisBackend.cache[language]);
			} else {
				const redisKey = `i18n:${language}`;
				const fullObject = JSON.parse(await redis.get(redisKey));

				if (!fullObject) {
					throw new Error(`Redis key "${redisKey}" is null`);
				}

				resetLifetime();
				RedisBackend.cache[language] = fullObject;

				callback(null, RedisBackend.cache[language]);
			}
		} catch (error) {
			callback(error, null);
		}
	}
};

export const uploadToRedis = () => {
	return Promise.all(
		availableLocales.map(async (locale) => {
			logger.info(`uploadToRedis: Updating ${locale}`);
			const translations = await import(`../../locales/${locale}`);
			const pipeline = redis.pipeline();

			for (const translation of Object.values(translations)) {
				pipeline.set(`i18n:${locale}`, JSON.stringify(translation));
			}

			await pipeline.exec();
			logger.info(`uploadToRedis: ${locale} done`);
		})
	);
};
