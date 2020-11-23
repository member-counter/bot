#!/usr/bin/env node
import getEnv from './utils/getEnv';
import startDiscordClient from './client';
import startStatusWS from './others/status';
import startDBClient from './db';

const { NODE_ENV } = getEnv();

const discordClient = startDiscordClient();
startDBClient();
startStatusWS(discordClient);

if (NODE_ENV === "production") {
	process
		.on('unhandledRejection', (reason, p) => {
			console.error("Unhandled Rejection at: Promise ", p, " reason: ", reason);
		})
		.on('uncaughtException', (exception) => {
			console.error("Uncaught Exception ", exception);
		});
}
export default discordClient