import { Redlock } from "@sesamecare-oss/redlock";
import { Redis } from "ioredis";

import { env } from "./env";

const createRedisClient = () => new Redis(env.REDIS_URL, { lazyConnect: true });

const globalForRedis = globalThis as unknown as {
  redis: ReturnType<typeof createRedisClient> | undefined;
};

export const redis = globalForRedis.redis ?? createRedisClient();

if (env.NODE_ENV !== "production") globalForRedis.redis = redis;

export const redlock = new Redlock([redis]);
