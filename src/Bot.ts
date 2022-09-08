import { Client } from "discord.js";

import config from "./config";
import { allEvents, allEventsNeededIntents } from "./events";
import { allCommandsNeededIntents } from "./interactions/commands";

export default class Bot {
	client: Client;
	constructor() {
		this.client = new Client({
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