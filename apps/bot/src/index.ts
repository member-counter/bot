import { Client } from "discord.js";

import { setupBotDataExchangeProvider } from "@mc/bot-data-exchange";
import { generateBotIntents } from "@mc/common/botIntents";
import { botPermissions } from "@mc/common/botPermissions";
import { generateInviteLink } from "@mc/common/generateInviteLink";
import { db } from "@mc/db";
import { redis } from "@mc/redis";

import { env } from "~/env";

async function main() {
  // TODO manage sharding
  const bot = new Client({
    intents: generateBotIntents(
      env.DISCORD_BOT_IS_PREMIUM,
      env.DISCORD_BOT_IS_PRIVILEGED,
    ),
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

  process.on("SIGTERM", () => {
    Promise.all([
      bot.destroy(),
      redis.quit(),
      BDERedisPubClient.quit(),
      BDERedisSubClient.quit(),
      db.$disconnect(),
    ])
      .catch((err) => {
        console.error("Error while trying to gracefully shutdown:", err);
      })
      .finally(() => {
        process.exit(0);
      });
  });
}

void main();
