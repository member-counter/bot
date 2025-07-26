import type { Client, Guild } from "discord.js";
import type { Redis } from "ioredis";

import { advertiseEvaluatorPriorityKey } from "@mc/common/redis/keys";

export async function checkPriority(
  guild: Guild,
  ctx: { botClient: Client; redisClient: Redis },
) {
  const { botClient, redisClient } = ctx;

  const handledPriority = Number(
    await redisClient.get(advertiseEvaluatorPriorityKey(guild.id)),
  );

  return (
    handledPriority <= botClient.botInstanceOptions.dataSourceComputePriority
  );
}
