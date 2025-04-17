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
  const redlock = new Redlock([redis], redlockOptions);

  // 1) Enqueue at tail
  await redis
    .multi()
    .lrem(queueKey, 0, queueEntryId)
    .rpush(queueKey, queueEntryId)
    .exec();

  try {
    while (true) {
      const queue = await redis.lrange(queueKey, 0, -1);
      const myPos = queue.indexOf(queueEntryId);
      if (myPos === -1) throw new Error("Lost from the queue");

      // only consider entries *ahead* of me (0..myPos‑1)
      const ahead = queue.slice(0, myPos);
      // batch‑remove any of those that aren’t valid
      for (const entry of ahead) {
        if (!(await isValidEntry(entry))) {
          await redis.lrem(queueKey, 0, entry);
        }
      }

      // re‑fetch head
      const head = ahead.length
        ? (await redis.lrange(queueKey, 0, 0))[0]
        : queueEntryId; // if nothing ahead, it's me

      if (head === undefined) throw new Error("Unexpected empty queue");

      if (head === queueEntryId) break;

      // if the head is not me, wait for my turn
      await sleep(queueCheckDelay);
    }

    // 3) Acquire work lock
    const workLock = await redlock.acquire([lockKey], lockTtl);

    try {
      return await task((ttl) => workLock.extend(ttl));
    } finally {
      await workLock.release();
    }
  } finally {
    // 4) Always dequeue ourselves
    await redis.lrem(queueKey, 0, queueEntryId);
  }
}
