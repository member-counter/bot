import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { identify, userGuilds } from "../services/discord";

export const discordRouter = createTRPCRouter({
  identify: protectedProcedure.query(({ ctx }) => {
    return identify(ctx.session.accessToken);
  }),
  guilds: protectedProcedure.query(({ ctx }) => {
    return userGuilds(ctx.session.accessToken);
  }),
  getUser: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input: { id } }) => {}),
});
