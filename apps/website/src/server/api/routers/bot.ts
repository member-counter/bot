import { z } from "zod";

import { botDataExchangeConsumer } from "@mc/services/botDataExchange/botDataExchangeConsumer";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const botRouter = createTRPCRouter({
  gamedigGames: protectedProcedure.query(() => {
    return botDataExchangeConsumer.gamedig.getGames.query();
  }),
  computeTemplate: protectedProcedure
    .input(
      z.object({
        template: z.string(),
        guildId: z.string(),
        channelId: z.string(),
      }),
    )
    .query(({ input }) => {
      return botDataExchangeConsumer.dataSource.computeTemplate.query(input);
    }),
});
