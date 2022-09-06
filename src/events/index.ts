import { Intents, Permissions } from "discord.js";
import type { Event } from "../structures";
import { interactionCreateEvent } from "./interactionCreate";
import { readyEvent } from "./ready";

const allEvents: Event<any>[] = [readyEvent, interactionCreateEvent];

const allEventsNeededPermissions: Permissions = new Permissions(
	allEvents.map((e) => e.neededPermissions)
);

const allEventsNeededIntents: Intents = new Intents(
	allEvents.map((e) => e.neededIntents)
);

export { allEvents, allEventsNeededPermissions, allEventsNeededIntents };
