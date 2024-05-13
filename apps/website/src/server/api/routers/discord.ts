import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { botDataExchangeConsumer } from "../services/botDataExchangeConsumer";
import { identify, userGuilds } from "../services/discord";

export const discordRouter = createTRPCRouter({
  identify: protectedProcedure.query(({ ctx }) => {
    return identify(ctx.session.accessToken);
  }),
  userGuilds: protectedProcedure.query(({ ctx }) => {
    return userGuilds(ctx.session.accessToken);
  }),
  getUser: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input: { id } }) => {
      return botDataExchangeConsumer.discord.getUser.query({ id });
    }),
  getGuild: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input: { id } }) => {
      return botDataExchangeConsumer.discord.getGuild.query({ id });
    }),
});
