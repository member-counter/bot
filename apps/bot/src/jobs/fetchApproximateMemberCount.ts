import type { Client } from "discord.js";
import pLimit from "p-limit";

import { Job } from "@mc/common/bot/structures/Job";
import {
  discordAPIIntensiveOperationLockKey,
  fetchMemembersQueueKey,
} from "@mc/common/redis/keys";

import { makeIsValidChild } from "~/utils/isValidChildId";
import { withQueueLock } from "~/utils/withQueueLock";

// This caps in-flight requests, not requests/second: the REST rate limiter
// still spends the full RPS budget, so the sweep finishes just as fast as an
// unbounded burst (sustaining 45 rps at ~150ms/request only needs ~7 in
// flight). What it fixes is queue depth: an interactive dashboard request
// arriving mid-sweep now waits behind at most 10 requests instead of behind
// every guild in the sweep.
const FETCH_CONCURRENCY = 10;

export const fetchApproximateMemberCount = (client: Client) =>
  new Job({
    disabled: client.botInstanceOptions.isPrivileged,
    name: "Fetch approximate member count",
    time: "0 */20 * * * *",
    runOnClientReady: true,
    execute: async (client) => {
      const { id, childId, logger } = client.botInstanceOptions;
      const queueKey = fetchMemembersQueueKey(id);
      const lockKey = discordAPIIntensiveOperationLockKey(id);

      await withQueueLock({
        queueKey,
        lockKey,
        queueEntryId: childId,
        isValidEntry: makeIsValidChild(client.botInstanceOptions),
        logger: logger.child({ task: "Fetch approximate member count" }),
        task: async () => {
          let debugCheckCount = 0;
          const limit = pLimit(FETCH_CONCURRENCY);

          await Promise.allSettled(
            client.guilds.cache.map((guild, _key, collection) =>
              limit(async () => {
                await client.guilds.fetch({
                  guild,
                  withCounts: true,
                  cache: true,
                  force: true,
                });

                logger.debug(
                  `Fetched approximate member count for guild ${guild.id} (${++debugCheckCount}/${collection.size})`,
                );
              }),
            ),
          );
        },
      });
    },
  });
