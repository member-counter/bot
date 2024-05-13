import { Client, IntentsBitField } from "discord.js";

import { setupBotDataExchangeProvider } from "@mc/bot-data-exchange";
import { db } from "@mc/db";
import { redis } from "@mc/redis";

import { env } from "~/env";

async function main() {
  const intents = new IntentsBitField();

  intents.add("Guilds");

  // TODO check how cache works
  intents.add("GuildModeration");

  if (env.DISCORD_BOT_IS_PREMIUM && env.DISCORD_BOT_IS_PRIVILEGED) {
    intents.add("GuildMembers");
    intents.add("GuildPresences");
  }

  if (env.DISCORD_BOT_IS_PREMIUM) {
    intents.add("GuildVoiceStates");
  }

  // TODO manage sharding
  const bot = new Client({ intents });

  bot.on("ready", () => {
    console.log("Bot started");
    console.log(`Logged in as ${bot.user?.tag}`);
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
