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
import { reAdvertiseOnRedisReconnect } from "./jobs/advertise";
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

  // When a proxy is set it owns the whole token's rate limits, so the local
  // limiter is disabled (Infinity) to not throttle twice. Requests can then
  // queue at the proxy instead, but @discordjs/rest still aborts after its
  // default 15s timeout, and the concurrency caps in the jobs keep at most a
  // few dozen requests queued there (drained at ~50/s → sub-second waits).
  const rest = options.restProxyURL
    ? { api: options.restProxyURL, globalRequestsPerSecond: Infinity }
    : { globalRequestsPerSecond: options.discordAPIRequestsPerSecond };

  const botClient = new Client({
    intents: generateBotIntents(options),
    shards: options.shards,
    shardCount: options.shardCount,
    waitGuildTimeout: 0,
    rest,
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
    logger: logger,
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
  reAdvertiseOnRedisReconnect(botClient);

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
