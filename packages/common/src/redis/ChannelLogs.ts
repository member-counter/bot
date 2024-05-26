import type { Redis } from "ioredis";

export const CHANNEL_LOG_BASE_KEY = "cl";

export const KindMap = {
  LastTemplateComputeError: "e",
  LastTemplateComputeTimestamp: "t",
} as const;

export function toChannelLogKey(channelId: string, kind: keyof typeof KindMap) {
  return `${CHANNEL_LOG_BASE_KEY}:${channelId}:${KindMap[kind]}`;
}

export async function getChannelLogs(redis: Redis, channelId: string) {
  const [lastTemplateComputeError, lastTemplateComputeTimestamp] =
    await Promise.all([
      redis.get(toChannelLogKey(channelId, "LastTemplateComputeError")),
      redis.get(toChannelLogKey(channelId, "LastTemplateComputeTimestamp")),
    ]);

  const lastTemplateComputeDate = lastTemplateComputeTimestamp
    ? new Date(Number(lastTemplateComputeTimestamp))
    : null;

  return {
    lastTemplateComputeError,
    lastTemplateComputeDate,
  };
}
