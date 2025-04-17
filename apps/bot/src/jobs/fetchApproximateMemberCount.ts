import type { Client } from "discord.js";

import { Job } from "@mc/common/bot/structures/Job";
import {
  discordAPIIntensiveOperationLockKey,
  fetchMemembersQueueKey,
} from "@mc/common/redis/keys";

import { makeIsValidChild } from "~/utils/isValidChildId";
import { withQueueLock } from "~/utils/withQueueLock";

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
        task: async (extendLock) => {
          let debugCheckCount = 0;

          await Promise.allSettled(
            client.guilds.cache.map(async (guild, _key, collection) => {
              await client.guilds.fetch({
                guild,
                withCounts: true,
                cache: true,
                force: true,
              });

              logger.debug(
                `Fetched approximate member count for guild ${guild.id} (${++debugCheckCount}/${collection.size})`,
              );

              await extendLock(15_000);
            }),
          );
        },
      });
    },
  });
