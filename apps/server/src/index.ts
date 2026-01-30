import * as trpcExpress from "@trpc/server/adapters/express";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import morgan from "morgan";

import logger from "@mc/logger";
import { appRouter, createTRPCContext } from "@mc/trpc-api";

import { refreshTokenIfNeeded } from "~/auth/oauth";
import { env } from "~/env";
import authRouter from "~/routes/auth";
import { getSession, setSession } from "~/session";
import { errorHandler } from "./middlewares/errorHandler";
import { errorHandlerPrisma } from "./middlewares/errorHandlerPrisma";
import { errorHandlerZod } from "./middlewares/errorHandlerZod";

const app = express();

app.set("trust proxy", true);

app.use(
  cors({
    origin: env.WEBSITE_URL,
    credentials: true,
  }),
);
app.use(morgan("short"));
app.use(cookieParser());

// tRPC endpoint
app.use(
  "/api/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: async ({ req, res }) => {
      // Get and refresh session
      let session = await getSession(req);
      const refreshedSession = await refreshTokenIfNeeded(session);

      // If session was refreshed, update the cookie
      if (refreshedSession && refreshedSession !== session) {
        session = refreshedSession;
        await setSession(res, session);
      }

      // Create tRPC context
      return createTRPCContext({ session });
    },
    onError: ({ path, error }) => {
      logger.error(`❌ tRPC failed on ${path ?? "<no-path>"}:`);
      logger.error(error);
    },
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Auth routes
app.use("/api", authRouter);

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use(errorHandlerPrisma);
app.use(errorHandlerZod);
app.use(errorHandler);

// Start server
app.listen(env.BACKEND_PORT, () => {
  logger.info(`Server listening on port ${env.BACKEND_PORT}`);
});
