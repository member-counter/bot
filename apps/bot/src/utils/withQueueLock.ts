import { setTimeout as sleep } from "timers/promises";
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
  task: (extendLock: (ttl: number) => Promise<Lock>) => Promise<T>;
}

export async function withQueueLock<T>({
  queueKey,
  queueEntryId,
  isValidEntry = () => true,
  queueCheckDelay = 5_000,
  lockKey,
  redlockOptions = { retryCount: Infinity, retryDelay: 15_000 },
  lockTtl = 15_000,
  task,
}: WithQueueLockOpts<T>): Promise<T> {
  await redis.lrem(queueKey, 0, queueEntryId);
  await redis.lpush(queueKey, queueEntryId);

  try {
    // wait for our turn, popping invalid entries
    while (true) {
      const queue = await redis.lrange(queueKey, 0, -1);
      const next = queue[queue.length - 1];
      if (!next) throw new Error("queue emptied unexpectedly");
      if (await isValidEntry(next)) {
        if (next === queueEntryId) break;
        await sleep(queueCheckDelay);
      } else {
        await redis.rpop(queueKey);
      }
    }

    const redlock = new Redlock([redis], redlockOptions);
    const lock = await redlock.acquire([lockKey], lockTtl);

    try {
      return await task((ttl) => lock.extend(ttl));
    } finally {
      await lock.release();
    }
  } finally {
    await redis.lrem(queueKey, 0, queueEntryId);
  }
}
