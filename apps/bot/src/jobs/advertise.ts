import type { Client } from "discord.js";
import type { Callback, Result } from "ioredis";

import { Job } from "@mc/common/bot/structures/Job";
import { advertiseEvaluatorPriorityKey } from "@mc/common/redis/keys";
import { redis } from "@mc/redis";

declare module "ioredis" {
  interface RedisCommander<Context> {
    advertiseEvaluatorPriority(
      key: string,
      argv: string,
      callback?: Callback<string>,
    ): Result<string, Context>;
  }
}

redis.defineCommand("advertiseEvaluatorPriority", {
  numberOfKeys: 1,
  lua: `
    local priority = tonumber(redis.call('GET', KEYS[1]))

    if not priority or (tonumber(ARGV[1]) >= priority) then
        redis.call('SET', KEYS[1], ARGV[1], 'EX', 900)
    end
  `,
});

const advertiseGuilds = async (client: Client) => {
  const computePriority =
    client.botInstanceOptions.dataSourceComputePriority.toString();

  const multi = redis.multi();

  for (const id of client.guilds.cache.keys()) {
    multi.advertiseEvaluatorPriority(
      advertiseEvaluatorPriorityKey(id),
      computePriority,
    );
  }

  await multi.exec();
};

export const advertise = new Job({
  name: "Advertise evaluator priority",
  time: "0 */5 * * * *",
  runOnClientReady: true,
  execute: advertiseGuilds,
});

/**
 * The advertise keys only live in Redis, so after a Redis restart they are
 * gone until the next cron tick; re-publish them as soon as the connection
 * comes back instead of leaving served guilds unadvertised for minutes.
 */
export const reAdvertiseOnRedisReconnect = (client: Client) => {
  redis.on("ready", () => {
    if (!client.isReady()) return;

    void advertiseGuilds(client).catch((error) =>
      client.botInstanceOptions.logger.error(
        "Failed to re-advertise after Redis reconnect",
        error,
      ),
    );
  });
};
