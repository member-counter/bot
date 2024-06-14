import type { IIdentifyThrottler } from "discord.js";
import { Redlock } from "@sesamecare-oss/redlock";

import { redis } from "@mc/redis";

import type { BotInstanceOptions } from "~/bot";

const redlock = new Redlock([redis]);

export class RedisIdentifyThrottler implements IIdentifyThrottler {
  constructor(private options: BotInstanceOptions) {}

  async waitForIdentify(shardId: number): Promise<void> {
    const key = `discord-identify-lock:${this.options.id}:${shardId % this.options.maxConcurrency}`;

    await redlock.acquire([key], 5_500);
  }
}
