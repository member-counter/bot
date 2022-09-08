import config from "./config";
import { Client } from "discord.js";
import { allEvents, allEventsNeededIntents } from "./events";
import { allCommandsNeededIntents } from "./interactions/commands";
import { apiVersion } from "./services";

export default class Bot {
	client: Client;
	constructor() {
		this.client = new Client({
			rest: { version: apiVersion },
			intents:
				allEventsNeededIntents.bitfield | allCommandsNeededIntents.bitfield,
			shards: config.discord.bot.shards,
			shardCount: config.discord.bot.shardCount
		});

		this.setupEvents();
	}

	setupEvents() {
		allEvents.forEach(({ name, handler }) => {
			this.client.on(name, handler);
		});
	}
}
