import assert from "assert";
import os from "os";
import type { Client } from "discord.js";
import type { Redis } from "ioredis";
import { Status } from "discord.js";
import { z } from "zod";

import type { BotInstanceOptions } from "../BotInstanceOptions";

export const toChannelName = (type: "req" | "res", botId: string) =>
  `bot-stats-${type}-${botId}`;

export type BotStats = z.infer<typeof BotStatsValidator>;
export const BotStatsValidator = z.object({
  botId: z.string(),
  childId: z.string(),
  shards: z.array(z.number()),
  shardCount: z.number(),
  clientStatus: z.nativeEnum(Status),
  userCount: z.number(),
  guildCount: z.number(),
  unavailableGuildCount: z.number(),
  memory: z.object({
    rss: z.number(),
    maxrss: z.number(),
  }),
  host: z.object({
    name: z.string(),
    memory: z.number(),
    cpus: z.number(),
    loadAvg: z.array(z.number()),
  }),
});

const generateStats = (
  botClient: Client,
  botInstanceOptions: BotInstanceOptions,
) => {
  assert(botClient.options.shards instanceof Array);
  assert(botClient.options.shardCount);

  const { id, childId, isPrivileged } = botInstanceOptions;

  const memoryUsage = process.memoryUsage();
  const resourceUsage = process.resourceUsage();

  return {
    botId: id,
    childId,
    shards: botClient.options.shards as number[],
    shardCount: botClient.options.shardCount,
    clientStatus: botClient.ws.status,
    userCount: botClient.guilds.cache.reduce(
      (acc, g) =>
        acc + (isPrivileged ? g.memberCount : g.approximateMemberCount ?? 0),
      0,
    ),
    guildCount: botClient.guilds.cache.size,
    unavailableGuildCount: botClient.guilds.cache.filter((g) => !g.available)
      .size,
    memory: {
      rss: memoryUsage.rss,
      maxrss: resourceUsage.maxRSS * 1024,
    },
    host: {
      name: os.hostname(),
      cpus: os.cpus().length,
      loadAvg: os.loadavg(),
      memory: os.totalmem(),
    },
  } satisfies BotStats;
};

interface Options {
  redisPubClient: Redis;
  redisSubClient: Redis;
}

export async function setupBotStatsProvider(
  options: Options & {
    botInstanceOptions: BotInstanceOptions;
    botClient: Client;
  },
) {
  const { botClient, redisSubClient, redisPubClient, botInstanceOptions } =
    options;

  await redisSubClient.subscribe(toChannelName("req", botInstanceOptions.id));

  redisSubClient.on("message", () => {
    void redisPubClient
      .publish(
        toChannelName("res", botInstanceOptions.id),
        JSON.stringify(generateStats(botClient, botInstanceOptions)),
      )
      .catch(botInstanceOptions.logger.error);
  });
}

export function setupBotStatsConsumer(options: Options) {
  const { redisSubClient, redisPubClient } = options;

  return async function getBotStats(botId: string) {
    const responses = new Map<string, BotStats>();

    await redisSubClient.subscribe(toChannelName("res", botId));

    return await new Promise((resolve: (botStats: BotStats[]) => void) => {
      setTimeout(() => {
        resolve([...responses.values()]);
      }, 5_000);

      redisSubClient.on("message", (_channel, res) => {
        const botStats = BotStatsValidator.parse(JSON.parse(res));
        responses.set(botStats.childId, botStats);

        const allBotStats = [...responses.values()];
        const collectedShardsCount = allBotStats.reduce(
          (acc, r) => r.shards.length + acc,
          0,
        );

        if (collectedShardsCount === botStats.shardCount) {
          resolve(allBotStats);
        }
      });

      void redisPubClient.publish(toChannelName("req", botId), "");
    }).finally(() => {
      void redisSubClient.unsubscribe(toChannelName("res", botId));
    });
  };
}
