import assert from "node:assert";
import { z } from "zod";

import botHasPermsToEdit from "@mc/common/botHasPermsToEdit";

import { checkPriority } from "../../checkPriority";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const botRouter = createTRPCRouter({
  getStats: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      await ctx.takeRequest(ctx.botClient.botInstanceOptions.id === input.id);

      return await ctx.botClient.fetchBotStats();
    }),

  canBotEditChannel: publicProcedure
    .input(z.object({ guildId: z.string(), channelId: z.string() }))
    .query(async ({ ctx, input }) => {
      const guild = ctx.botClient.guilds.cache.get(input.guildId);
      const channel = await guild?.channels.fetch(input.channelId);
      const hasPriority =
        !!guild && !!channel && (await checkPriority(guild, ctx));

      await ctx.takeRequest(hasPriority);

      assert(guild);
      assert(channel);

      return botHasPermsToEdit(channel);
    }),
});
