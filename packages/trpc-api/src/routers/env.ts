import { env } from "../env";
import { publicProcedure } from "../trpc";

export const envRouter = publicProcedure.query(() => {
  return {
    DISCORD_CLIENT_ID: env.DISCORD_CLIENT_ID,
  };
});
