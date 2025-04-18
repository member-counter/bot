import type { Client } from "discord.js";

import { env } from "~/env";
import { guildAvailableEvent, guildCreateEvent } from "./guildCreate";
import { interactionCreateEvent } from "./interactionCreate";
import { messageCreateEvent } from "./messageCreate";
import { readyEvent } from "./ready";

const allEvents = [
  readyEvent,
  guildCreateEvent,
  guildAvailableEvent,
  messageCreateEvent,
  interactionCreateEvent,
] as const;

export function setupEvents(client: Client) {
  const { logger } = client.botInstanceOptions;

  if (env.LOG_LEVEL === "debug") {
    client.on("debug", (message) => {
      logger.debug(message);
    });
  }

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
