import { randomUUID } from "node:crypto";
import type { Redis } from "ioredis";

import baseLogger from "@mc/logger";
import { redis } from "@mc/redis";

const logger = baseLogger.child({ component: "ProcessCache" });
// Log errors as logger.error(message, error). The logger replaces the message
// with the stack when the error is in a field, such as { error }.

// All processes publish and receive invalidations on this channel.
const INVALIDATION_CHANNEL = "process-cache:invalidate";

// Each entry lives for a random time between these two parts of the TTL.
// This spreads the reloads over time, so many entries do not expire together.
const TTL_MIN_FACTOR = 0.8;
const TTL_MAX_FACTOR = 1.2;

// A write waits at most this time for the invalidation publish. The publish
// continues after this time, and ioredis sends it when Redis is back.
const PUBLISH_WAIT_MS = 1000;

// Identify this process in invalidation messages. A process removes the keys
// locally before it publishes, so it ignores its own messages.
const PROCESS_ID = randomUUID();

interface InvalidationMessage {
  origin: string;
  cache: string;
  keys: string[];
}

interface Entry<V> {
  value: V;
  expiresAt: number;
}

// The keys invalidated while one load is in progress. The load does not store
// these keys, because their loaded values can be old.
interface LoadState {
  invalidatedKeys: Set<string>;
  isCleared: boolean;
}

// A set for each name. If a module loads two times (for example, with hot
// reload), both instances continue to receive invalidations.
const caches = new Map<string, Set<ProcessCache<unknown>>>();

let subscriber: Redis | null = null;
// The cache is in use only while the subscriber receives invalidations.
// While it is false, every read goes to the loader.
let isSubscribed = false;

const clearAll = () =>
  caches.forEach((set) => set.forEach((cache) => cache.clear()));

// Start the subscriber on the first read, not on import. A process that never
// reads from a cache does not open the extra Redis connection.
function ensureSubscriber() {
  if (subscriber) return;

  subscriber = redis.duplicate();

  subscriber.on("message", (channel: string, raw: string) => {
    if (channel !== INVALIDATION_CHANNEL) return;

    let message: InvalidationMessage;
    try {
      message = JSON.parse(raw) as InvalidationMessage;
    } catch {
      logger.warn("Received an invalid cache invalidation message", { raw });
      return;
    }

    if (message.origin === PROCESS_ID) return;

    caches
      .get(message.cache)
      ?.forEach((cache) => cache.invalidateLocal(message.keys));
  });

  // ioredis reconnects by itself. The "close" handler below disables the cache
  // until then, so log the error and do nothing more.
  subscriber.on("error", (error: unknown) => {
    logger.warn("Cache invalidation subscriber error", error);
  });

  // Messages sent while the connection is down are lost. Clear all entries
  // when the connection closes, and use the cache again after it subscribes.
  subscriber.on("close", () => {
    isSubscribed = false;
    clearAll();
  });

  subscriber.on("ready", () => {
    subscriber
      ?.subscribe(INVALIDATION_CHANNEL)
      .then(() => {
        clearAll();
        isSubscribed = true;
      })
      .catch((error: unknown) => {
        logger.error("Failed to subscribe to cache invalidations", error);
      });
  });

  subscriber.connect().catch((error: unknown) => {
    logger.error("Failed to connect the cache invalidation subscriber", error);
  });
}

/**
 * In-memory cache for DB reads, shared by all code in one process.
 *
 * - Writes must call `invalidate` after the DB write completes. This removes
 *   the keys here and in every other process through Redis pub/sub.
 * - A value of `null` means "no row in the DB" and is cached too.
 * - Values are copied on read, so callers can change them safely.
 * - Concurrent reads of the same missing key share one load.
 * - The TTL is only a safety limit for lost invalidation messages.
 */
export class ProcessCache<V> {
  private readonly entries = new Map<string, Entry<V>>();
  // Loads that are in progress. Each value is a private copy of the result.
  private readonly pending = new Map<string, Promise<V>>();
  private readonly activeLoads = new Set<LoadState>();

  constructor(
    private readonly options: {
      name: string;
      ttlMs: number;
      maxEntries: number;
    },
  ) {
    const set = caches.get(options.name) ?? new Set();
    set.add(this as ProcessCache<unknown>);
    caches.set(options.name, set);
  }

  /**
   * Return a value for each key. `load` receives only the keys that are not
   * in the cache and not already in a load. It must return a value for each
   * key it receives.
   */
  async getMany(
    keys: string[],
    load: (missingKeys: string[]) => Promise<Map<string, V>>,
  ): Promise<Map<string, V>> {
    ensureSubscriber();

    const result = new Map<string, V>();
    const keysToLoad: string[] = [];
    const waits: Promise<void>[] = [];
    const now = Date.now();

    for (const key of new Set(keys)) {
      const entry = isSubscribed ? this.entries.get(key) : undefined;

      if (entry && entry.expiresAt > now) {
        // Move the key to the end of the map. The first key is the next one
        // to remove when the cache is full.
        this.entries.delete(key);
        this.entries.set(key, entry);
        result.set(key, structuredClone(entry.value));
        continue;
      }

      const pending = this.pending.get(key);
      if (pending) {
        waits.push(
          pending.then((value) => {
            result.set(key, structuredClone(value));
          }),
        );
        continue;
      }

      keysToLoad.push(key);
    }

    if (keysToLoad.length) {
      waits.push(
        this.load(keysToLoad, load).then((loaded) => {
          loaded.forEach((value, key) => result.set(key, value));
        }),
      );
    }

    // Give all promises to Promise.all before the first await. Then a failed
    // load is always handled, and never becomes an unhandled rejection.
    await Promise.all(waits);
    return result;
  }

  /** Remove the keys in this process and in all other processes. */
  async invalidate(keys: string[]) {
    if (!keys.length) return;

    this.invalidateLocal(keys);

    const message: InvalidationMessage = {
      origin: PROCESS_ID,
      cache: this.options.name,
      keys,
    };
    const publish = redis
      .publish(INVALIDATION_CHANNEL, JSON.stringify(message))
      .catch((error: unknown) => {
        // A process that has lost Redis also clears its cache, because its
        // subscriber disconnects. Only a process that still has Redis keeps
        // the old value, until the TTL expires.
        logger.error(
          `Failed to publish a cache invalidation for "${message.cache}"`,
          error,
        );
      });

    // Do not let a slow Redis block the write that called this function.
    let timeout: NodeJS.Timeout | undefined;
    await Promise.race([
      publish,
      new Promise<void>((resolve) => {
        timeout = setTimeout(resolve, PUBLISH_WAIT_MS);
      }),
    ]);
    clearTimeout(timeout);
  }

  /** Remove the keys only in this process. */
  invalidateLocal(keys: string[]) {
    this.activeLoads.forEach((state) =>
      keys.forEach((key) => state.invalidatedKeys.add(key)),
    );
    keys.forEach((key) => {
      this.entries.delete(key);
      // New reads must start a new load. The current load can have old data.
      this.pending.delete(key);
    });
  }

  clear() {
    this.activeLoads.forEach((state) => (state.isCleared = true));
    this.entries.clear();
    this.pending.clear();
  }

  private async load(
    keys: string[],
    load: (missingKeys: string[]) => Promise<Map<string, V>>,
  ) {
    // Store results only when the cache was in use for the whole load. A
    // disconnect during the load clears the cache and sets isCleared.
    const state: LoadState = {
      invalidatedKeys: new Set(),
      isCleared: !isSubscribed,
    };
    this.activeLoads.add(state);

    const batch = load(keys).then((loaded) => {
      for (const key of keys) {
        if (loaded.get(key) === undefined) {
          throw new Error(
            `ProcessCache "${this.options.name}": load did not return key "${key}"`,
          );
        }
      }
      return loaded;
    });

    // Each key gets its own copy of the result before the caller receives the
    // original value. The caller can then change its value safely.
    const perKey = keys.map((key) => {
      const promise = batch.then(
        (loaded) => structuredClone(loaded.get(key)) as V,
      );
      // Waiters handle the error. This stops an unhandled rejection when there
      // are no waiters.
      promise.catch(() => undefined);
      this.pending.set(key, promise);
      return [key, promise] as const;
    });

    try {
      const loaded = await batch;

      if (!state.isCleared && isSubscribed) {
        for (const [key, promise] of perKey) {
          if (state.invalidatedKeys.has(key)) continue;
          this.set(key, await promise);
        }
      }

      return loaded;
    } finally {
      this.activeLoads.delete(state);
      for (const [key, promise] of perKey) {
        // Do not remove a newer load that started after an invalidation.
        if (this.pending.get(key) === promise) this.pending.delete(key);
      }
    }
  }

  private set(key: string, value: V) {
    const ttlFactor =
      TTL_MIN_FACTOR + Math.random() * (TTL_MAX_FACTOR - TTL_MIN_FACTOR);

    this.entries.delete(key);
    this.entries.set(key, {
      value,
      expiresAt: Date.now() + this.options.ttlMs * ttlFactor,
    });

    while (this.entries.size > this.options.maxEntries) {
      const oldestKey = this.entries.keys().next().value;
      if (oldestKey === undefined) break;
      this.entries.delete(oldestKey);
    }
  }
}
