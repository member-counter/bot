import type { DataSourceId } from "../DataSource";
import type { KindKeyMap } from "./ChannelLogs";

enum BaseKeys {
  ChannelLog,
  DataSourceCache,
  AdvertiseEvaluatorPriority,
  DiscordIdentifyLock,
  DiscordAPIIntensiveOperation,
  UpdateChannelsQueue,
}

export const channelLogKey = (
  channelId: string,
  kind: (typeof KindKeyMap)[keyof typeof KindKeyMap],
) => `${BaseKeys.ChannelLog}:${channelId}:${kind}`;

export const dataSourceCacheKey = <I extends DataSourceId>(
  id: I,
  additionalId: string,
) => `${BaseKeys.DataSourceCache}:${id}:${additionalId}`;

export const advertiseEvaluatorPriorityKey = (guildId: string) =>
  `${BaseKeys.AdvertiseEvaluatorPriority}:${guildId}`;

export const discordIdentifyLockKey = (
  botId: string,
  shardId: number,
  maxConcurrency: number,
) => `${BaseKeys.DiscordIdentifyLock}:${botId}:${shardId % maxConcurrency}`;

export const discordAPIIntensiveOperationLockKey = (botId: string) =>
  `${BaseKeys.DiscordAPIIntensiveOperation}:${botId}`;

export const updateChannelsQueueKey = (botId: string) =>
  `${BaseKeys.UpdateChannelsQueue}:${botId}`;
