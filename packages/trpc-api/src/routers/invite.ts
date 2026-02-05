import { env } from "../env";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const inviteRouter = createTRPCRouter({
  botId: publicProcedure.query(() => {
    return env.DISCORD_CLIENT_ID;
  }),
});
