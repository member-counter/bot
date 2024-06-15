import type baseLogger from "@mc/logger";
import type { ActivitiesOptions } from "discord.js";
import { Client } from "discord.js";

import { setupBotDataExchangeProvider } from "@mc/bot-data-exchange";
import { generateBotIntents } from "@mc/common/botIntents";
import { redis } from "@mc/redis";

import { setupEvents } from "./events";
import { setupJobs } from "./jobs";
import { deployCommands } from "./utils/deployCommands";
import { makeCache } from "./utils/makeCache";
import { RedisIdentifyThrottler } from "./utils/RedisIdentifyThrottler";
import { sweepers } from "./utils/sweepers";

declare module "discord.js" {
  interface Client {
    botInstanceOptions: BotInstanceOptions;
  }
}

export interface BotInstanceOptions {
  id: string;
  token: string;
  shards: number[];
  shardCount: number;
  maxConcurrency: number;
  deployCommands: boolean | string;
  presenceActivity: ActivitiesOptions[];
  stats: {
    DBGGToken?: string;
    DBLToken?: string;
    BFDToken?: string;
  };
  dataSourceComputePriority: number;
  logger: typeof baseLogger;
  isPremium: boolean;
  isPrivileged: boolean;
}

export async function startBot(options: BotInstanceOptions) {
  await deployCommands(options);

  const { logger } = options;

  // TODO filter guilds

  const bot = new Client({
    intents: generateBotIntents(options.isPrivileged, options.isPremium),
    shards: options.shards,
    shardCount: options.shardCount,
    ws: {
      buildIdentifyThrottler: () => new RedisIdentifyThrottler(options),
    },
    waitGuildTimeout: 30_000,
    makeCache: makeCache(options),
    sweepers,
  });

  bot.botInstanceOptions = options;

  const BDERedisPubClient = redis.duplicate();
  const BDERedisSubClient = redis.duplicate();
  await setupBotDataExchangeProvider({
    redisClient: redis,
    redisPubClient: BDERedisPubClient,
    redisSubClient: BDERedisSubClient,
    botClient: bot,
  });

  setupEvents(bot);
  setupJobs(bot);

  logger.info("Bot starting...");
  await bot.login(options.token);

  return { bot, BDERedisPubClient, BDERedisSubClient };
}
