import { GuildSettings } from "@mc/common/GuildSettings";

import { EventHandler } from "../structures";

export const guildCreateEvent = new EventHandler({
  name: "guildCreate",
  handler: async (guild) => {
    await GuildSettings.upsert(guild.id);
  },
});
