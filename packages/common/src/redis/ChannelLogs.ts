import { z } from "zod";

import { redis } from "@mc/redis";

import { channelLogKey } from "./keys";

export const CHANNEL_LOG_BASE_KEY = "cl";

export const KindKeyMap = {
  LastTemplateComputeError: "e",
  LastTemplateUpdateDate: "t",
} as const;

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
      .map((kind) => channelLogKey(channelId, kind))
      .map((key) => redis.get(key)),
  );

  return {
    LastTemplateComputeError:
      z.string().optional().safeParse(logs[0]).data ?? null,
    LastTemplateUpdateDate: logs[1]
      ? z.coerce.date().optional().safeParse(Number(logs[1])).data
      : null,
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
        const key = channelLogKey(channelId, KindKeyMap[kind]);
        if (value == null) {
          await redis.del(key);
        } else {
          await redis.set(key, value);
        }
      }),
  );
}
