import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  isAuthenticated: publicProcedure.query(({ ctx }) => {
    return ctx.session != null;
  }),
});
