import type { BotInstanceOptions } from "../bot/BotInstanceOptions";
import type { BotStats } from "../redis/BotStats";

declare module "discord.js" {
  interface Client {
    botInstanceOptions: BotInstanceOptions;
    fetchBotStats: () => Promise<BotStats[]>;
  }
}
