import { z } from "zod";

import { botDataExchangeConsumer } from "@mc/services/botDataExchange/botDataExchangeConsumer";

import { env } from "~/env";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

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

  getStatus: publicProcedure.query(() => {
    return Promise.all(
      env.PUBLIC_BOTS_IDS.map(async (id) => ({
        id,
        stats: await botDataExchangeConsumer.bot.getStats
          .query({ id })
          .catch(() => null),
      })),
    );
  }),
});
