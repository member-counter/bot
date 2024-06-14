import type { Client } from "discord.js";

import { guildCreateEvent } from "./guildCreate";
import { interactionCreateEvent } from "./interactionCreate";
import { messageCreateEvent } from "./messageCreate";
import { readyEvent } from "./ready";

const allEvents = [
  readyEvent,
  guildCreateEvent,
  messageCreateEvent,
  interactionCreateEvent,
] as const;

export function setupEvents(client: Client) {
  const { logger } = client.botInstanceOptions;
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
