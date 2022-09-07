#!/usr/bin/env node
import Redis from "ioredis";

import config from "./config";
import logger from "./logger";
import { availableLocales } from "./services/i18n";

(async () => {
	const redis = new Redis(config.redis.port, config.redis.host, {
		password: config.redis.password
	});

	logger.info("Loading translations to redis");

	await Promise.all(
		availableLocales.map(async (locale) => {
			logger.info(`Updating ${locale}`);
			const translations = await import(`./locales/${locale}`);
			const pipeline = redis.pipeline();

			for (const [key, translation] of Object.entries(translations) as [
				string,
				string
			][]) {
				pipeline.set(`i18n:${locale}:${key}`, translation);
			}

			await pipeline.exec();
			logger.info(`${locale} done`);
		})
	);

	logger.info("All done");

	process.exit(0);
})();
