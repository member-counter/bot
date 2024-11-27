#!/usr/bin/env node
import type { BotInstanceOptions } from "@mc/common/BotInstanceOptions";

import { db } from "@mc/db";
import baseLogger from "@mc/logger";
import { redis } from "@mc/redis";

import { startBot } from "./bot";
import { env } from "./env";

async function main() {
  const logger = baseLogger.child({
    botId: env.DISCORD_BOT_INSTANCE_ID,
    botChildId: env.DISCORD_BOT_INSTANCE_CHILD_ID,
  });

  const botOptions: BotInstanceOptions = {
    id: env.DISCORD_BOT_INSTANCE_ID,
    childId: env.DISCORD_BOT_INSTANCE_CHILD_ID,
    token: env.DISCORD_BOT_INSTANCE_TOKEN,
    deployCommands: env.DISCORD_BOT_INSTANCE_DEPLOY_COMMANDS,
    isPremium: env.DISCORD_BOT_INSTANCE_IS_PREMIUM,
    isPrivileged: env.DISCORD_BOT_INSTANCE_IS_PRIVILEGED,
    dataSourceComputePriority: env.DISCORD_BOT_INSTANCE_COMPUTE_PRIORITY,
    discordAPIRequestsPerSecond: env.DISCORD_BOT_INSTANCE_DISCORD_API_RPS,
    logger,
    shards: env.DISCORD_BOT_INSTANCE_SHARDING_SHARDS,
    shardCount: env.DISCORD_BOT_INSTANCE_SHARDING_SHARD_COUNT,
    maxConcurrency: env.DISCORD_BOT_INSTANCE_SHARDING_SHARD_MAX_CONCURRENCY,
    presenceActivity: env.DISCORD_BOT_INSTANCE_BOT_PRESENCE_ACTIVITY,
    presenceStatus: env.DISCORD_BOT_INSTANCE_BOT_STATUS,
    stats: {
      BFDToken: env.DISCORD_BOT_INSTANCE_STATS_BFD_TOKEN,
      DBGGToken: env.DISCORD_BOT_INSTANCE_STATS_DBGG_TOKEN,
      DBLToken: env.DISCORD_BOT_INSTANCE_STATS_DBL_TOKEN,
    },
  };

  const { botClient, redisClients } = await startBot(botOptions).catch(
    (err) => {
      logger.error("Failed to start the bot", err);
      process.exit(1);
    },
  );

  process.on("SIGTERM", () => {
    Promise.all([
      botClient.destroy(),
      redis.quit(),
      Promise.all(redisClients.map((c) => c.quit())),
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
