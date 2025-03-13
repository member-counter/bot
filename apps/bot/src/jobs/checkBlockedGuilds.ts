import { Job } from "@mc/common/bot/structures/Job";
import { GuildSettingsService } from "@mc/services/guildSettings";

export const checkBlockedGuilds = new Job({
  name: "Check blocked guilds",
  time: "0 0 * * * *",
  runOnClientReady: true,
  execute: async (client) => {
    const blockedGuilds = await GuildSettingsService.areBlocked([
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
