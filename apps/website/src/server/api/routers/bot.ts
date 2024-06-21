import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { botDataExchangeConsumer } from "../services/botDataExchangeConsumer";

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
