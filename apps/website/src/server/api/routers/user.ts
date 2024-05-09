import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { identify, userGuilds } from "~/server/auth";

export const userRouter = createTRPCRouter({
  isAuthenticated: publicProcedure.query(({ ctx }) => {
    return ctx.session != null;
  }),
  identify: protectedProcedure.query(({ ctx }) => {
    return identify(ctx.session.accessToken);
  }),
  guilds: protectedProcedure.query(({ ctx }) => {
    return userGuilds(ctx.session.accessToken);
  }),
});
