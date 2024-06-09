#!/usr/bin/env node
import { db } from "@mc/db";
import logger from "@mc/logger";
import { redis } from "@mc/redis";

import { initBot } from "./bot";

async function main() {
  const { bot, BDERedisPubClient, BDERedisSubClient } = await initBot().catch(
    (err) => {
      logger.error("Failed to start the bot", err);
      process.exit(1);
    },
  );

  process.on("SIGTERM", () => {
    Promise.all([
      bot.destroy(),
      redis.quit(),
      BDERedisPubClient.quit(),
      BDERedisSubClient.quit(),
      db.$disconnect(),
    ])
      .catch((error: unknown) => {
        logger.error("Error while trying to gracefully shutdown:", { error });
      })
      .finally(() => {
        process.exit(0);
      });
  });
}

void main();
