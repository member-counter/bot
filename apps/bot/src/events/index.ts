import type { Client } from "discord.js";

import logger from "@mc/logger";

import { guildCreateEvent } from "./guildCreate";
import { messageCreateEvent } from "./messageCreate";
import { readyEvent } from "./ready";

const allEvents = [readyEvent, guildCreateEvent, messageCreateEvent] as const;

export function setupEvents(client: Client) {
  allEvents.forEach((event) => {
    client.on(event.name, (...args) => {
      void (async () => {
        try {
          const definitelyNotNeverArgs: never[] = args as never;
          await event.handler(...definitelyNotNeverArgs);
        } catch (error) {
          logger.error(error);
        }
      })();
    });
  });
}
