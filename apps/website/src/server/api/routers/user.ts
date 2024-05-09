import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { userGuilds } from "~/server/auth";

export const userRouter = createTRPCRouter({
  identify: publicProcedure.query(({ ctx }) => {
    return ctx.authUser;
  }),
  guilds: protectedProcedure.query(({ ctx }) => {
    return userGuilds(ctx.sessionTokens.accessToken);
  }),
});
