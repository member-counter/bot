import type { BotInstanceOptions } from "../bot/BotInstanceOptions";
import type { setupBotStatsConsumer } from "../redis/BotStats";

declare module "discord.js" {
  interface Client {
    botInstanceOptions: BotInstanceOptions;
    fetchBotStats: () => ReturnType<ReturnType<typeof setupBotStatsConsumer>>;
  }
}
