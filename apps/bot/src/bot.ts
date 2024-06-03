import { Client } from "discord.js";

import { setupBotDataExchangeProvider } from "@mc/bot-data-exchange";
import { generateBotIntents } from "@mc/common/botIntents";
import logger from "@mc/logger";
import { redis } from "@mc/redis";

import { env } from "./env";
import { setupEvents } from "./events";
import { deployCommands } from "./utils/deployCommands";

export async function initBot() {
  if (env.AUTO_DEPLOY_COMMANDS) {
    await deployCommands();
  }

  // TODO manage sharding
  const bot = new Client({
    intents: generateBotIntents(
      env.DISCORD_BOT_IS_PREMIUM,
      env.DISCORD_BOT_IS_PRIVILEGED,
    ),
    waitGuildTimeout: 30000,
  });

  logger.info("Bot starting...");
  await bot.login(env.DISCORD_BOT_TOKEN);

  setupEvents(bot);

  const BDERedisPubClient = redis.duplicate();
  const BDERedisSubClient = redis.duplicate();
  await setupBotDataExchangeProvider({
    redisClient: redis,
    redisPubClient: BDERedisPubClient,
    redisSubClient: BDERedisSubClient,
    botClient: bot,
  });

  return { bot, BDERedisPubClient, BDERedisSubClient };
}
