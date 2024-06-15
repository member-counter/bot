import type { IIdentifyThrottler } from "discord.js";
import { Redlock } from "@sesamecare-oss/redlock";

import { discordIdentifyLockKey } from "@mc/common/redis/keys";
import { redis } from "@mc/redis";

import type { BotInstanceOptions } from "~/bot";

const redlock = new Redlock([redis]);

export class RedisIdentifyThrottler implements IIdentifyThrottler {
  constructor(private options: BotInstanceOptions) {}

  async waitForIdentify(shardId: number): Promise<void> {
    await redlock.acquire(
      [
        discordIdentifyLockKey(
          this.options.id,
          shardId,
          this.options.maxConcurrency,
        ),
      ],
      5_500,
    );
  }
}
