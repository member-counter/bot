import type { Client } from "discord.js";
import type { Redis } from "ioredis";

import { redisHandler } from "@mc/trpc-redis";

import { env } from "../../env";
import { appRouter } from "./trcp/root";
import { createTRPCContext, DropRequestError } from "./trcp/trpc";

interface Clients {
  redisClient: Redis;
  redisSubClient: Redis;
  redisPubClient: Redis;
  botClient: Client;
}

export const setupBotDataExchangeProvider = async ({
  redisClient,
  redisSubClient,
  redisPubClient,
  botClient,
}: Clients) =>
  redisHandler({
    redisSubClient,
    redisPubClient,
    router: appRouter,
    createContext: ({ requestId }) =>
      createTRPCContext({
        botClient,
        redisClient,
        requestId,
        clientTimeout: env.BDE_CALL_TIMEOUT,
      }),
    onError:
      env.NODE_ENV === "development"
        ? ({ path, error }) => {
            if (error.cause instanceof DropRequestError) return;

            console.error(
              `❌ bot-data-exchange tRPC failed on ${path ?? "<no-path>"}: ${error.message}`,
            );
          }
        : undefined,
  });
