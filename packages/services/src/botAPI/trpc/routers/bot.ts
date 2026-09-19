import assert from "node:assert";
import type { BotStats } from "@mc/common/redis/BotStats";
import { z } from "zod";

import botHasPermsToEdit from "@mc/common/botHasPermsToEdit";

import { checkPriority } from "../../checkPriority";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const botRouter = createTRPCRouter({
  getStats: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      await ctx.takeRequest(ctx.botClient.botInstanceOptions.id === input.id);
      const stats: BotStats[] = await ctx.botClient.fetchBotStats();
      return stats;
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
