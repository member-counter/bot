import type logger from "@mc/logger";
import type { ActivitiesOptions } from "discord.js";

export interface BotInstanceOptions {
  id: string;
  childId: string;
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
  logger: typeof logger;
  isPremium: boolean;
  isPrivileged: boolean;
  discordAPIRequestsPerSecond: number;
}
