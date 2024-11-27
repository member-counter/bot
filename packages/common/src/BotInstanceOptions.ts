import type logger from "@mc/logger";
import type { ActivitiesOptions, PresenceStatusData } from "discord.js";

export interface BotInstanceOptions {
  id: string;
  childId: string;
  token: string;
  shards: number[];
  shardCount: number;
  maxConcurrency: number;
  deployCommands: boolean | string;
  presenceActivity: ActivitiesOptions[];
  presenceStatus: PresenceStatusData;
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
