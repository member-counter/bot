import { IntentsBitField, PermissionsBitField } from "discord.js";
import type { Event } from "../structures";
import { interactionCreateEvent } from "./interactionCreate";
import { readyEvent } from "./ready";
import { messageCreateEvent } from "./messageCreate";

const allEvents: Event<any>[] = [
	readyEvent,
	interactionCreateEvent,
	messageCreateEvent
];

const allEventsNeededPermissions: PermissionsBitField = new PermissionsBitField(
	allEvents.map((e) => e.neededPermissions)
);

const allEventsNeededIntents: IntentsBitField = new IntentsBitField(
	allEvents.map((e) => e.neededIntents)
);

export { allEvents, allEventsNeededPermissions, allEventsNeededIntents };
