import { z } from "zod";

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
});
