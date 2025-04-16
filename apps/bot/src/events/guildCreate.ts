import type { Guild } from "discord.js";

import { EventHandler } from "@mc/common/bot/structures/EventHandler";
import { advertiseEvaluatorPriorityKey } from "@mc/common/redis/keys";
import { redis } from "@mc/redis";
import { GuildSettingsService } from "@mc/services/guildSettings";

const defaultHandler = async (guild: Guild) => {
  await GuildSettingsService.upsert(guild.id);

  if (await GuildSettingsService.isBlocked(guild.id)) {
    await guild.leave();
  }

  await redis.advertiseEvaluatorPriority(
    advertiseEvaluatorPriorityKey(guild.id),
    guild.client.botInstanceOptions.dataSourceComputePriority.toString(),
  );
};

export const guildCreateEvent = new EventHandler({
  name: "guildCreate",
  async handler(guild) {
    await defaultHandler(guild);

    if (!guild.client.botInstanceOptions.isPrivileged) {
      await guild.client.guilds.fetch({
        guild,
        withCounts: true,
        cache: true,
        force: true,
      });
    }
  },
});

export const guildAvailableEvent = new EventHandler({
  name: "guildAvailable",
  async handler(guild) {
    await defaultHandler(guild);

    if (
      guild.client.botInstanceOptions.isPremium &&
      guild.client.botInstanceOptions.isPrivileged
    ) {
      await guild.members.fetch({ withPresences: true });
    }
  },
});
