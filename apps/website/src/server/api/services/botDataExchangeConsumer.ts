import type { Redis } from "ioredis";

import { createBotDataExchangeConsumer } from "@mc/bot-data-exchange";
import { redis } from "@mc/redis";

import { env } from "~/env";

const createRedisClient = () => redis.duplicate();

const globalForBDE = globalThis as unknown as {
  redisPubClient: Redis | undefined;
  redisSubClient: Redis | undefined;
};

export const redisPubClient =
  globalForBDE.redisPubClient ?? createRedisClient();
export const redisSubClient =
  globalForBDE.redisSubClient ?? createRedisClient();

if (env.NODE_ENV !== "production") {
  globalForBDE.redisPubClient = redisPubClient;
  globalForBDE.redisSubClient = redisSubClient;
}

export const botDataExchangeConsumer = await createBotDataExchangeConsumer({
  redisPubClient,
  redisSubClient,
});
