import { Client } from "discord.js";

import { setupBotDataExchangeProvider } from "@mc/bot-data-exchange";
import { generateBotIntents } from "@mc/common/botIntents";
import { botPermissions } from "@mc/common/botPermissions";
import { generateInviteLink } from "@mc/common/generateInviteLink";
import { db } from "@mc/db";
import logger from "@mc/logger";
import { redis } from "@mc/redis";

import { env } from "./env";

export async function initBot() {
  // TODO manage sharding
  const bot = new Client({
    intents: generateBotIntents(
      env.DISCORD_BOT_IS_PREMIUM,
      env.DISCORD_BOT_IS_PRIVILEGED,
    ),
    waitGuildTimeout: 30000,
  });

  bot.on("ready", () => {
    logger.info("Bot ready");

    if (bot.user) {
      logger.info(`Logged in as ${bot.user.tag}`);
      logger.info(
        `Invite link: ${generateInviteLink({ clientId: bot.user.id, permissions: botPermissions })}`,
      );
    }
  });

  bot.on("guildAvailable", (guild) => {
    void db.guild.upsert({
      create: { discordGuildId: guild.id, formatSettings: {} },
      where: { discordGuildId: guild.id },
      update: {},
    });
  });

  logger.info("Bot starting...");
  await bot.login(env.DISCORD_BOT_TOKEN);

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
