import { z } from "zod";

import botHasPermsToEdit from "@mc/common/botHasPermsToEdit";

import { checkPriority } from "../../checkPriority";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const botRouter = createTRPCRouter({
  getStats: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      if (ctx.botClient.botInstanceOptions.id != input.id)
        await ctx.dropRequest();

      await ctx.lockRequest();

      return await ctx.botClient.fetchBotStats();
    }),

  canBotEditChannel: publicProcedure
    .input(z.object({ guildId: z.string(), channelId: z.string() }))
    .query(async ({ ctx, input }) => {
      const guild = ctx.botClient.guilds.cache.get(input.guildId);

      if (!guild) {
        await ctx.dropRequest();
        return;
      }

      await ctx.lockRequest();

      const hasPriority = await checkPriority(guild, ctx);

      if (!hasPriority) {
        await ctx.dropRequest();
        return;
      }

      const channel = await guild.channels.fetch(input.channelId);

      if (!channel) {
        await ctx.dropRequest();
        return;
      }

      return botHasPermsToEdit(channel);
    }),
});
