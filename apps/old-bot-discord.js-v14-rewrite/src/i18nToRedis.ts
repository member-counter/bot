#!/usr/bin/env node
import logger from "./logger";
import { uploadToRedis } from "./services/i18n/RedisBackend";

(async () => {
	logger.info("Loading translations to redis");

	await uploadToRedis();

	logger.info("All done");

	process.exit(0);
})();
