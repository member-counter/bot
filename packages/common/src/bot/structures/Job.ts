import type { Client } from "discord.js";

export class Job {
  name: string;
  time: string;
  runOnClientReady?: boolean;
  disabled?: boolean;
  execute: (client: Client<true>) => Promise<void>;

  constructor(options: Job) {
    this.name = options.name;
    this.time = options.time;
    this.runOnClientReady = options.runOnClientReady;
    this.execute = options.execute;
  }
}
