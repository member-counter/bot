import { z } from "zod";

import { botAPIConsumer } from "@mc/services/botAPI/botAPIConsumer";

import { env } from "~/env";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const botRouter = createTRPCRouter({
  gamedigGames: protectedProcedure.query(() => {
    return botAPIConsumer.gamedig.getGames.query();
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
      return botAPIConsumer.dataSource.computeTemplate.query(input);
    }),

  getStatus: publicProcedure.query(() => {
    return Promise.all(
      env.PUBLIC_BOTS_IDS.map(async (id) => ({
        id,
        stats: await botAPIConsumer.bot.getStats
          .query({ id })
          .catch(() => null),
      })),
    );
  }),
});
