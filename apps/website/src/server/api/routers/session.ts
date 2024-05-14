import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const sessionRouter = createTRPCRouter({
  isAuthenticated: publicProcedure.query(({ ctx }) => {
    return ctx.session != null;
  }),
  user: protectedProcedure.query(({ ctx }) => {
    return ctx.authUser;
  }),
});
