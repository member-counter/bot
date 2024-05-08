import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  identify: publicProcedure.query(({ ctx }) => {
    return ctx.authUser;
  }),
});
