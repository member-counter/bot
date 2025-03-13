import type { ClientEvents } from "discord.js";

export class EventHandler<E extends keyof ClientEvents> {
  name: E;
  handler: (...args: ClientEvents[E]) => void | Promise<void>;

  constructor(options: EventHandler<E>) {
    this.name = options.name;
    this.handler = options.handler;
  }
}

export default EventHandler;
