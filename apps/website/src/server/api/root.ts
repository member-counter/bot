import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { botRouter } from "./routers/bot";
import { demoServersRouter } from "./routers/demoServers";
import { discordRouter } from "./routers/discord";
import { donorRouter } from "./routers/donor";
import { guildRouter } from "./routers/guild";
import { sessionRouter } from "./routers/session";
import { userRouter } from "./routers/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  session: sessionRouter,
  user: userRouter,
  guild: guildRouter,
  discord: discordRouter,
  bot: botRouter,
  demoServers: demoServersRouter,
  donor: donorRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
