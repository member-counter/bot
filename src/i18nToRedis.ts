#!/usr/bin/env node
import config from "./config";
import Redis from "ioredis";
import { availableLocales } from "./services/i18n";

(async () => {
	const redis = new Redis(config.redis.port, config.redis.host, {
		password: config.redis.password
	});

	console.log("Loading translations to redis");

	await Promise.all(
		availableLocales.map(async (locale) => {
			console.log(`Updating ${locale}`);
			const translations = await import(`./locales/${locale}`);
			const pipeline = redis.pipeline();

			for (const [key, translation] of Object.entries(translations) as [
				string,
				string
			][]) {
				pipeline.set(`i18n:${locale}:${key}`, translation);
			}

			await pipeline.exec();
			console.log(`${locale} done`);
		})
	);

	console.log("All done");

	process.exit(0);
})();
