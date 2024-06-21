import { dataSourceRouter } from "./routers/dataSource";
import { discordRouter } from "./routers/discord";
import { gamedigRouter } from "./routers/gamedig";
import { createCallerFactory, createTRPCRouter } from "./trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  discord: discordRouter,
  gamedig: gamedigRouter,
  dataSource: dataSourceRouter,
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
