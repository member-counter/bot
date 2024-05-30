import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { botDataExchangeConsumer } from "../services/botDataExchangeConsumer";

export const botRouter = createTRPCRouter({
  gamedigGames: protectedProcedure.query(() => {
    return botDataExchangeConsumer.gamedig.getGames.query();
  }),
});
