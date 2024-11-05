import type { Guild } from "discord.js";

import { advertiseEvaluatorPriorityKey } from "@mc/common/redis/keys";
import { redis } from "@mc/redis";
import { GuildSettingsService } from "@mc/services/guildSettings";

import { EventHandler } from "../structures";

const handler = async (guild: Guild) => {
  await GuildSettingsService.upsert(guild.id);

  if (await GuildSettingsService.isBlocked(guild.id)) {
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
