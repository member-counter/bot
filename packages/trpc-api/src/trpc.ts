/**
 * tRPC API initialization.
 *
 * This is where the tRPC API is initialized, connecting the context and transformer.
 * ZodErrors are parsed for frontend typesafety when procedures fail due to validation errors.
 */
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

import { KnownError } from "@mc/common/KnownError/index";

import type { TRPCContext } from "./context";
import { Errors } from "./utils/errors";

/**
 * tRPC initialization with context and transformer.
 */
const t = initTRPC.context<TRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    // If the error cause is a KnownError, use its message for the error message
    // This allows the frontend to properly parse and translate known errors
    const knownErrorMessage =
      error.cause instanceof KnownError ? error.cause.message : null;

    return {
      ...shape,
      message: knownErrorMessage ?? shape.message,
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
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API.
 * It does not guarantee that a user querying is authorized, but you can still access
 * user session data if they are logged in.
 */
export const publicProcedure = t.procedure;

/**
 * Protected (authenticated) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use this.
 * It verifies the session is valid and guarantees `ctx.session` and `ctx.authUser` are not null.
 *
 * @see https://trpc.io/docs/procedures
 */
export const protectedProcedure = publicProcedure.use(({ ctx, next }) => {
  if (!ctx.session || !ctx.authUser) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: Errors.NotAuthenticated,
    });
  }

  return next({
    ctx: {
      session: { ...ctx.session },
      authUser: { ...ctx.authUser },
    },
  });
});
