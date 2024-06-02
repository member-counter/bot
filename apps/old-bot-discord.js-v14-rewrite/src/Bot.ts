import { Client, IntentsBitField } from "discord.js";

import config from "./config";
import { allEvents, allEventsNeededIntents } from "./events";
import { allCommandsNeededIntents } from "./interactions/commands";
import { apiVersion } from "./services";

export default class Bot {
	client: Client;
	constructor() {
		this.client = new Client({
			rest: { version: apiVersion },
			// TODO: improve
			intents: config.premium.thisBotIsPremium
				? allEventsNeededIntents.bitfield |
				  allCommandsNeededIntents.bitfield |
				  IntentsBitField.Flags.GuildPresences |
				  IntentsBitField.Flags.GuildVoiceStates
				: allEventsNeededIntents.bitfield | allCommandsNeededIntents.bitfield,
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
