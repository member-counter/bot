#!/usr/bin/env node
import getEnv from './utils/getEnv';
import Bot from './client';
import DatabaseClient from './db';
import BasicStatusWebsite from './others/status';

const { NODE_ENV, DISTRIBUTED } = getEnv();

Bot.init();
DatabaseClient.init();
if (!DISTRIBUTED) BasicStatusWebsite.init();

if (NODE_ENV === "production") {
	process
		.on('unhandledRejection', (reason, p) => {
			console.error("Unhandled Rejection at: Promise ", p, " reason: ", reason);
		})
		.on('uncaughtException', (exception) => {
			console.error("Uncaught Exception ", exception);
		});
}
