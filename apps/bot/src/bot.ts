import { Client } from "discord.js";

import { setupBotDataExchangeProvider } from "@mc/bot-data-exchange";
import { generateBotIntents } from "@mc/common/botIntents";
import { botPermissions } from "@mc/common/botPermissions";
import { generateInviteLink } from "@mc/common/generateInviteLink";
import { db } from "@mc/db";
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
    console.log("Bot ready");

    if (bot.user) {
      console.log(`Logged in as ${bot.user.tag}`);
      console.log(
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

  console.log("Bot starting...");
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
