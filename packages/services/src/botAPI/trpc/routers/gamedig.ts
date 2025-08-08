import { games } from "gamedig";

import { createTRPCRouter, publicProcedure } from "../trpc";

const transformed: Record<
  string,
  {
    name: string;
    port?: number;
  }
> = Object.fromEntries(
  Object.entries(games).map(([gameId, gameSpec]) => [
    gameId,
    {
      name: gameSpec.name,
      port: gameSpec.options.port_query ?? gameSpec.options.port,
    },
  ]),
);

export const gamedigRouter = createTRPCRouter({
  getGames: publicProcedure.query(async ({ ctx }) => {
    await ctx.takeRequest(true);

    return transformed;
  }),
});
