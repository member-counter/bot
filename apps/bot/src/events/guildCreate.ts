import { GuildSettings } from "@mc/common/GuildSettings";
import { redis } from "@mc/redis";

import { advertiseEvaluatorPrioritykey } from "~/jobs/advertise";
import { EventHandler } from "../structures";

export const guildCreateEvent = new EventHandler({
  name: "guildCreate",
  handler: async (guild) => {
    await GuildSettings.upsert(guild.id);
    await redis.advertiseEvaluatorPriority(
      advertiseEvaluatorPrioritykey(guild.id),
      guild.client.botInstanceOptions.dataSourceComputePriority.toString(),
    );
  },
});
