/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */

import type { Client } from "discord.js";
import type { Redis } from "ioredis";
import { Redlock } from "@sesamecare-oss/redlock";
import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

import { RES_CHANNEL } from "@mc/trpc-redis/Constants";
import { trpcTracing } from "@mc/trpc-telemetry";

export class DropRequestError extends Error {}

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */
export const createTRPCContext = (opts: {
  botClient: Client;
  redisClient: Redis;
  requestId: string;
  clientTimeout: number;
}) => {
  const redLock = new Redlock([opts.redisClient], { retryCount: 0 });

  const dropRequest = () => {
    return new Promise((_resolve, reject) =>
      /**
       * let's wait at least the client's timeout
       * so the procedure that got the lock first
       * can have the chance to respond
       */
      setTimeout(
        () => reject(new DropRequestError()),
        opts.clientTimeout + 1000,
      ),
    );
  };

  /**
   * Some procedures will need this to lock a request.
   */
  const lockRequest = async () => {
    const lockKey = ["lock", RES_CHANNEL, opts.requestId].join(":");
    await redLock
      .acquire([lockKey], opts.clientTimeout, {
        retryCount: 0,
      })
      .catch(dropRequest);
  };

  return {
    ...opts,
    redLock,
    lockRequest,
    dropRequest,
  };
};

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * Create a server-side caller.
 *
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory;

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */
export const publicProcedure = t.procedure.concat(trpcTracing());
