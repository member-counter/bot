import type { Client } from "discord.js";
import type { Redis } from "ioredis";

import { redisHandler } from "@mc/trpc-redis";

import { env } from "../../env";
import { appRouter } from "./trpc/root";
import { createTRPCContext } from "./trpc/trpc";

interface Clients {
  redisClient: Redis;
  redisSubClient: Redis;
  redisPubClient: Redis;
  botClient: Client;
}

export const setupBotAPIProvider = async ({
  redisClient,
  redisSubClient,
  redisPubClient,
  botClient,
}: Clients) =>
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
    onError:
      env.NODE_ENV === "development"
        ? ({ path, error }) => {
            console.error(
              `❌ bot-data-exchange tRPC failed on ${path ?? "<no-path>"}: ${error.message}`,
            );
          }
        : undefined,
  });
