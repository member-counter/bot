import { GuildSettings } from "@mc/common/GuildSettings";

import { Job } from "~/structures/Job";

export const checkBlockedGuilds = new Job({
  name: "Check blocked guilds",
  time: "0 0 * * * *",
  runOnClientReady: true,
  execute: async (client) => {
    const blockedGuilds = await GuildSettings.areBlocked([
      ...client.guilds.cache.keys(),
    ]);

    await Promise.all(
      blockedGuilds.map(async ({ discordGuildId }) => {
        const guild = await client.guilds.fetch(discordGuildId);
        await guild.leave();
      }),
    );
  },
});
