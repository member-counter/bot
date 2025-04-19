import type { BotInstanceOptions } from "@mc/common/bot/BotInstanceOptions";
import type { IIdentifyThrottler } from "discord.js";
import { Redlock } from "@sesamecare-oss/redlock";

import { discordIdentifyLockKey } from "@mc/common/redis/keys";
import { redis } from "@mc/redis";

const redlock = new Redlock([redis], {
  retryCount: Infinity,
  retryDelay: 5_500,
});

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
