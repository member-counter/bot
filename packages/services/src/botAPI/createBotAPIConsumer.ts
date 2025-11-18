import { inspect } from "util";
import type { Redis } from "ioredis";
import { createTRPCClient, loggerLink } from "@trpc/client";
import SuperJSON from "superjson";

import logger from "@mc/logger";
import { redisLink } from "@mc/trpc-redis";

import type { AppRouter } from "./trpc/root";
import { env } from "../../env";

interface PubSubClients {
  redisSubClient: Redis;
  redisPubClient: Redis;
}

export const createBotAPIConsumer = async ({
  redisSubClient,
  redisPubClient,
}: PubSubClients) =>
  createTRPCClient<AppRouter>({
    links: [
      loggerLink({
        enabled: (op) =>
          env.LOG_LEVEL === "debug" ||
          (op.direction === "down" && op.result instanceof Error),

        console: {
          log: (...args) => {
            logger.child({ component: "tRPC" }).debug(inspect(args));
          },
          error: (...args) => {
            logger.child({ component: "tRPC" }).error(inspect(args));
          },
        },
        colorMode: "none",
      }),
      await redisLink({
        transformer: SuperJSON,
        requestTimeout: env.BDE_CALL_TIMEOUT,
        redisPubClient,
        redisSubClient,
      }),
    ],
  });
