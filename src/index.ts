#!/usr/bin/env node
import config from "./config";
import Bot from "./Bot";
import mongoose from "mongoose";
import logger from "./logger";
import { deployCommands } from "./utils/deployCommands";

// Bot
const bot = new Bot();
(async () => {
	if (config.discord.autoDeployCommands) {
		await deployCommands().catch(() => null);
	}
	bot.client.login(config.discord.bot.token);
})();

// Database
mongoose
	.connect(config.db.uri)
	.then(() => {
		logger.info("Database connection ready");
	})
	.catch(logger.error);

if (config.env === "production") {
	process
		.on("unhandledRejection", (reason, p) => {
			logger.error("Unhandled Rejection at: Promise ", p, " reason: ", reason);
		})
		.on("uncaughtException", (exception) => {
			logger.error("Uncaught Exception ", exception);
		})
		.on("SIGTERM", async () => {
			bot.client.destroy();
			await mongoose.disconnect();
			process.exit(0);
		});
}
