import { setTimeout as sleep } from "timers/promises";
import type { Client } from "discord.js";
import { Redlock } from "@sesamecare-oss/redlock";

import { Job } from "@mc/common/bot/structures/Job";
import {
  discordAPIIntensiveOperationLockKey,
  fetchMemembersQueueKey,
} from "@mc/common/redis/keys";
import { redis } from "@mc/redis";

export const fetchApproximateMemberCount = (client: Client) => {
  return new Job({
    disabled: client.botInstanceOptions.isPrivileged,
    name: "Fetch approximate member count",
    time: "0 */10 * * * *",
    runOnClientReady: true,
    execute: async (client) => {
      const { id, childId } = client.botInstanceOptions;

      const queueKey = fetchMemembersQueueKey(id);
      const queue = await redis.lrange(queueKey, 0, -1);

      if (!queue.includes(childId)) {
        await redis.lpush(queueKey, childId);
      }

      while (true) {
        const [nextTurn] = await redis.lrange(queueKey, -1, -1);

        if (nextTurn === childId) {
          break;
        } else {
          await sleep(5_000);
        }
      }

      const redlock = new Redlock([redis], {
        retryCount: Infinity,
        retryDelay: 15_000,
      });

      let lock = await redlock.acquire(
        [discordAPIIntensiveOperationLockKey(id)],
        15_000,
      );

      await Promise.all(
        client.guilds.cache.map(async (guild) => {
          await client.guilds.fetch({
            guild,
            withCounts: true,
            cache: true,
            force: true,
          });

          lock = await lock.extend(15_000);
        }),
      );

      await lock.release();
      await redis.rpop(queueKey);
    },
  });
};
