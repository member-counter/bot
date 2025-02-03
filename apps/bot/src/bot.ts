import type { BotInstanceOptions } from "@mc/common/BotInstanceOptions";
import { Client } from "discord.js";

import { generateBotIntents } from "@mc/common/botIntents";
import {
  setupBotStatsConsumer,
  setupBotStatsProvider,
} from "@mc/common/redis/BotStats";
import { redis } from "@mc/redis";
import { setupBotDataExchangeProvider } from "@mc/services/botAPI/setupBotDataExchangeProvider";

import { setupEvents } from "./events";
import { setupJobs } from "./jobs";
import { deployCommands } from "./utils/deployCommands";
import { makeCache } from "./utils/makeCache";
import { RedisIdentifyThrottler } from "./utils/RedisIdentifyThrottler";
import { sweepers } from "./utils/sweepers";

export async function startBot(options: BotInstanceOptions) {
  await deployCommands(options);

  const { logger } = options;

  const botClient = new Client({
    intents: generateBotIntents(options),
    shards: options.shards,
    shardCount: options.shardCount,
    rest: {
      globalRequestsPerSecond: options.discordAPIRequestsPerSecond,
    },
    ws: {
      buildIdentifyThrottler: () => new RedisIdentifyThrottler(options),
    },
    makeCache: makeCache(options),
    sweepers,
  });

  const BDERedisPubClient = redis.duplicate();
  const BDERedisSubClient = redis.duplicate();
  await setupBotDataExchangeProvider({
    redisClient: redis,
    redisPubClient: BDERedisPubClient,
    redisSubClient: BDERedisSubClient,
    botClient: botClient,
  });

  const BSPRedisPubClient = redis.duplicate();
  const BSPRedisSubClient = redis.duplicate();
  await setupBotStatsProvider({
    botClient,
    redisPubClient: BSPRedisPubClient,
    redisSubClient: BSPRedisSubClient,
    botInstanceOptions: options,
  });

  const BSCRedisPubClient = redis.duplicate();
  const BSCRedisSubClient = redis.duplicate();
  const fetchBotStatsFn = setupBotStatsConsumer({
    redisPubClient: BSCRedisPubClient,
    redisSubClient: BSCRedisSubClient,
  });

  botClient.botInstanceOptions = options;
  botClient.fetchBotStats = () => fetchBotStatsFn(options.id);

  setupEvents(botClient);
  setupJobs(botClient);

  logger.info("Bot starting...");
  await botClient.login(options.token);

  return {
    botClient: botClient,
    redisClients: [
      BDERedisPubClient,
      BDERedisSubClient,
      BSPRedisPubClient,
      BSPRedisSubClient,
      BSCRedisPubClient,
      BSCRedisSubClient,
    ],
  };
}
