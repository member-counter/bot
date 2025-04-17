import { debug } from "console";
import { setTimeout as sleep } from "timers/promises";
import type logger from "@mc/logger";
import type { Lock } from "@sesamecare-oss/redlock";
import { Redlock } from "@sesamecare-oss/redlock";

import { redis } from "@mc/redis";

interface WithQueueLockOpts<T> {
  queueKey: string;
  queueEntryId: string;
  isValidEntry?: (entry: string) => Promise<boolean> | boolean;
  queueCheckDelay?: number;
  lockKey: string;
  redlockOptions?: Partial<ConstructorParameters<typeof Redlock>[1]>;
  lockTtl?: number;
  logger?: typeof logger;
  task: (extendLock: (ttl: number) => Promise<Lock>) => Promise<T>;
}

export async function withQueueLock<T>({
  queueKey,
  queueEntryId,
  isValidEntry = () => true,
  queueCheckDelay = 5_000,
  lockKey,
  redlockOptions = { retryCount: 5, retryDelay: 15_000 },
  lockTtl = 15_000,
  task,
  logger,
}: WithQueueLockOpts<T>): Promise<T> {
  const redlock = new Redlock([redis], redlockOptions);

  logger?.debug(`Queueing ${queueEntryId} in ${queueKey}...`);
  // 1) Enqueue at tail
  await redis
    .multi()
    .lrem(queueKey, 0, queueEntryId)
    .rpush(queueKey, queueEntryId)
    .exec();
  logger?.debug(`Enqueued ${queueEntryId} in ${queueKey} at tail`);

  try {
    while (true) {
      logger?.debug(`Checking queue ${queueKey}...`);
      const queue = await redis.lrange(queueKey, 0, -1);
      logger?.debug(`Queue ${queueKey} is now:`, queue);

      const myPos = queue.indexOf(queueEntryId);
      if (myPos === -1) {
        logger?.error(`Failed to find ${queueEntryId} in ${queueKey}`);

        throw new Error("Lost from the queue");
      }

      // only consider entries *ahead* of me (0..myPos‑1)
      const ahead = queue.slice(0, myPos);
      // batch‑remove any of those that aren’t valid
      for (const entry of ahead) {
        if (!(await isValidEntry(entry))) {
          logger?.debug(`Removing invalid entry ${entry} from ${queueKey}`);
          await redis.lrem(queueKey, 0, entry);
          logger?.debug(
            `Removed invalid entry ${entry} from ${queueKey} successfully`,
          );
        }
      }

      // re‑fetch head
      logger?.debug(`Fetching head of ${queueKey}...`);
      const head = ahead.length
        ? (await redis.lrange(queueKey, 0, 0))[0]
        : queueEntryId; // if nothing ahead, it's me
      logger?.debug(`Head of ${queueKey} is ${head}`);

      if (head === undefined) {
        logger?.error(
          `Unexpected empty queue ${queueKey} while waiting for ${queueEntryId}`,
        );
        throw new Error("Unexpected empty queue");
      }

      if (head === queueEntryId) {
        logger?.debug(`I am the head of ${queueKey}, proceeding with work...`);
        break;
      }

      // if the head is not me, wait for my turn+
      logger?.debug(`I am not the head of ${queueKey}, waiting for my turn...`);
      await sleep(queueCheckDelay);
    }

    // 3) Acquire work lock
    logger?.debug(`Acquiring lock ${lockKey}...`);
    const workLock = await redlock.acquire([lockKey], lockTtl);
    logger?.debug(`Acquired lock ${lockKey}`);

    try {
      logger?.debug(`Running task...`);
      const returnValue = await task((ttl) => workLock.extend(ttl));
      logger?.debug(`Task finished successfully`);

      return returnValue;
    } finally {
      logger?.debug(`Releasing lock ${lockKey}...`);
      await workLock.release();
      logger?.debug(`Released lock ${lockKey}`);
    }
  } finally {
    // 4) Always dequeue ourselves
    logger?.debug(`Dequeueing ${queueEntryId} from ${queueKey}...`);
    await redis.lrem(queueKey, 0, queueEntryId);
    logger?.debug(`Dequeued ${queueEntryId} from ${queueKey}`);
  }
}
