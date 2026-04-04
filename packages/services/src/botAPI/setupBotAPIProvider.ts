import type baseLogger from "@mc/logger";
import type { Client } from "discord.js";
import type { Redis } from "ioredis";

import { redisHandler } from "@mc/trpc-redis";

import { appRouter } from "./trpc/root";
import { createTRPCContext } from "./trpc/trpc";

interface Options {
  redisClient: Redis;
  redisSubClient: Redis;
  redisPubClient: Redis;
  botClient: Client;
  logger: typeof baseLogger;
}

export const setupBotAPIProvider = async ({
  redisClient,
  redisSubClient,
  redisPubClient,
  botClient,
  logger,
}: Options) =>
  redisHandler({
    redisSubClient,
    redisPubClient,
    router: appRouter,
    createContext: ({ requestId, takeRequest }) =>
      createTRPCContext({
        botClient,
        redisClient,
        requestId,
        takeRequest,
      }),
    onError: ({ path, error }) => {
      logger.error(
        `❌ bot-data-exchange tRPC failed on ${path ?? "<no-path>"}: ${error.message}`,
      );
    },
  });
