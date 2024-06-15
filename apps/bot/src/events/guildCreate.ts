import type { Guild } from "discord.js";

import { GuildSettings } from "@mc/common/GuildSettings";
import { advertiseEvaluatorPriorityKey } from "@mc/common/redis/keys";
import { redis } from "@mc/redis";

import { EventHandler } from "../structures";

const handler = async (guild: Guild) => {
  await GuildSettings.upsert(guild.id);

  if (await GuildSettings.isBlocked(guild.id)) {
    await guild.leave();
  }

  await redis.advertiseEvaluatorPriority(
    advertiseEvaluatorPriorityKey(guild.id),
    guild.client.botInstanceOptions.dataSourceComputePriority.toString(),
  );

  if (
    guild.client.botInstanceOptions.isPremium &&
    guild.client.botInstanceOptions.isPrivileged
  ) {
    await guild.members.fetch({ withPresences: true });
  }
};

export const guildCreateEvent = new EventHandler({
  name: "guildCreate",
  handler,
});

export const guildAvailableEvent = new EventHandler({
  name: "guildAvailable",
  handler,
});
