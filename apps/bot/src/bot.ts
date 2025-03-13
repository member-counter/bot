import type { BotInstanceOptions } from "@mc/common/bot/BotInstanceOptions";
import { Client } from "discord.js";

import { generateBotIntents } from "@mc/common/bot/botIntents";
import { deployCommands } from "@mc/common/bot/deployCommands";
import {
  setupBotStatsConsumer,
  setupBotStatsProvider,
} from "@mc/common/redis/BotStats";
import { redis } from "@mc/redis";
import { setupBotAPIProvider } from "@mc/services/botAPI/setupBotAPIProvider";

import { setupEvents } from "./events";
import { AVAILABLE_LANGUAGES, DEFAULT_LANGUAGE, initI18n } from "./i18n";
import { allCommands } from "./interactions/commands";
import { setupJobs } from "./jobs";
import { makeCache } from "./utils/makeCache";
import { RedisIdentifyThrottler } from "./utils/RedisIdentifyThrottler";
import { sweepers } from "./utils/sweepers";

export async function startBot(options: BotInstanceOptions) {
  await deployCommands({
    ...options,
    availableLanguages: AVAILABLE_LANGUAGES,
    defaultLanguage: DEFAULT_LANGUAGE,
    initI18n: initI18n,
    commands: allCommands,
  });

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
  await setupBotAPIProvider({
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
