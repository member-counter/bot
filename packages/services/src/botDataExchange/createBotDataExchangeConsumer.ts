import type { Redis } from "ioredis";
import { createTRPCClient, loggerLink } from "@trpc/client";
import SuperJSON from "superjson";

import { redisLink } from "@mc/trpc-redis";

import type { AppRouter } from "./trcp/root";
import { env } from "~/env";

interface PubSubClients {
  redisSubClient: Redis;
  redisPubClient: Redis;
}

export const createBotDataExchangeConsumer = async ({
  redisSubClient,
  redisPubClient,
}: PubSubClients) =>
  createTRPCClient<AppRouter>({
    links: [
      loggerLink({
        enabled: (op) =>
          env.NODE_ENV === "development" ||
          (op.direction === "down" && op.result instanceof Error),
      }),
      await redisLink({
        transformer: SuperJSON,
        requestTimeout: env.BDE_CALL_TIMEOUT,
        redisPubClient,
        redisSubClient,
      }),
    ],
  });
