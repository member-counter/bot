import type { Callback, Result } from "ioredis";

import { advertiseEvaluatorPriorityKey } from "@mc/common/redis/keys";
import { redis } from "@mc/redis";

import { Job } from "~/structures/Job";

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

export const advertise = new Job({
  name: "Advertise evaluator priority",
  time: "0 */5 * * * *",
  runOnClientReady: true,
  execute: async (client) => {
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
  },
});
