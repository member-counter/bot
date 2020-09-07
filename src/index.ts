#!/usr/bin/env node
import * as Eris from 'eris';
import mongoose, { mongo } from 'mongoose';
import getEnv from './utils/getEnv';
import injectEventHandlers from './utils/injectEventHandlers';
import statusWS from './others/status';

const { PREMIUM_BOT, DISCORD_CLIENT_TOKEN, DB_URI, NODE_ENV } = getEnv();

// Discord client
const intents: Eris.IntentStrings[] = [
	'guilds',
	'guildBans',
	'guildMessages',
	'directMessages',
	'guildMessageReactions',
	'directMessageReactions',
];

if (PREMIUM_BOT) intents.push('guildMembers', 'guildPresences', 'guildVoiceStates');

const client = new Eris.Client(DISCORD_CLIENT_TOKEN, {
	getAllUsers: PREMIUM_BOT,
	guildCreateTimeout: 15000,
	intents,
	maxShards: 'auto',
	messageLimit: 0,
	defaultImageFormat: 'jpg',
	compress: true,
	restMode: true,
});

injectEventHandlers(client);

client.connect();

// Mongoose connection
mongoose
	.connect(DB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
	})
	.then(() => {
		console.log('[Mongoose] Connection ready');
	})
	.catch(console.error);

statusWS(client, mongoose);


if (NODE_ENV === "production") {
	process.on('unhandledRejection', (reason, p) => {
    console.error("Unhandled Rejection at: Promise ", p, " reason: ", reason);
	});
	process.on('uncaughtException', (exception) => {
    console.error("Uncaught Exception ", exception);
	});
}
