import { z } from "zod";

import { redis } from "@mc/redis";

export const CHANNEL_LOG_BASE_KEY = "cl";

export const KindKeyMap = {
  LastTemplateComputeError: "e",
  LastTemplateComputeTimestamp: "t",
} as const;

function toChannelLogKey(
  channelId: string,
  kind: (typeof KindKeyMap)[keyof typeof KindKeyMap],
) {
  return `${CHANNEL_LOG_BASE_KEY}:${channelId}:${kind}`;
}

function serialize(value: unknown): string | null {
  if (value instanceof Date) {
    return value.getTime().toString();
  } else if (typeof value === "string" || value === null) {
    return value;
  } else {
    throw Error("Unsupported type of value");
  }
}

export async function getChannelLogs(channelId: string) {
  const logs = await Promise.all(
    Object.values(KindKeyMap)
      .map((kind) => toChannelLogKey(channelId, kind))
      .map((key) => redis.get(key)),
  );

  return {
    LastTemplateComputeError:
      z.coerce.string().optional().parse(logs[0]) ?? null,
    LastTemplateComputeDate: z.coerce.date().optional().parse(logs[1]) ?? null,
  };
}

export async function setChannelLog(
  channelId: string,
  log: Partial<Awaited<ReturnType<typeof getChannelLogs>>>,
) {
  await Promise.all(
    Object.entries(log)
      .map(
        ([kind, value]) =>
          [kind, serialize(value)] as [keyof typeof KindKeyMap, string | null],
      )
      .map(async ([kind, value]) => {
        const key = toChannelLogKey(channelId, KindKeyMap[kind]);
        if (value === null) {
          await redis.del(key);
        } else {
          await redis.set(key, value);
        }
      }),
  );
}
