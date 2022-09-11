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

export const RedisBackend: {
	redis: null | Redis.Redis;
	cache: {
		// TODO: Improve this, There is almost certainly a better way to do this
		"ca-ES"?: typeof import("../../locales/ca-ES.json");
		"cs-CZ"?: typeof import("../../locales/cs-CZ.json");
		"de-DE"?: typeof import("../../locales/de-DE.json");
		"en-US"?: typeof import("../../locales/en-US.json");
		"es-ES"?: typeof import("../../locales/es-ES.json");
		"fa-IR"?: typeof import("../../locales/fa-IR.json");
		"fr-FR"?: typeof import("../../locales/fr-FR.json");
		"he-IL"?: typeof import("../../locales/he-IL.json");
		"hi-IN"?: typeof import("../../locales/hi-IN.json");
		"it-IT"?: typeof import("../../locales/it-IT.json");
		"pl-PL"?: typeof import("../../locales/pl-PL.json");
		"pt-BR"?: typeof import("../../locales/pt-BR.json");
		"ru-RU"?: typeof import("../../locales/ru-RU.json");
		"tr-TR"?: typeof import("../../locales/tr-TR.json");
	};
	cacheTime: {
		"ca-ES"?: NodeJS.Timeout;
		"cs-CZ"?: NodeJS.Timeout;
		"de-DE"?: NodeJS.Timeout;
		"en-US"?: NodeJS.Timeout;
		"es-ES"?: NodeJS.Timeout;
		"fa-IR"?: NodeJS.Timeout;
		"fr-FR"?: NodeJS.Timeout;
		"he-IL"?: NodeJS.Timeout;
		"hi-IN"?: NodeJS.Timeout;
		"it-IT"?: NodeJS.Timeout;
		"pl-PL"?: NodeJS.Timeout;
		"pt-BR"?: NodeJS.Timeout;
		"ru-RU"?: NodeJS.Timeout;
		"tr-TR"?: NodeJS.Timeout;
	};
	type: "backend";
	read: (
		language: typeof availableLocales[number],
		namespace: any,
		callback: any
	) => Promise<void>;
} = {
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
