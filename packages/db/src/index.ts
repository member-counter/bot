import { PrismaClient } from "@prisma/client";

import baseLogger from "@mc/logger";

import { env } from "./env";

const logger = baseLogger.child({
  component: "db",
});

const createPrismaClient = () => {
  const db = new PrismaClient({
    log: (["error", "warn", "info", "query"] as const).map((level) => ({
      emit: "event",
      level: level,
    })),
    errorFormat: "minimal",
  });

  db.$on("error", (e) => {
    logger.error(e.message);
  });

  db.$on("warn", (e) => {
    logger.warn(e.message);
  });

  db.$on("info", (e) => {
    logger.info(e.message);
  });

  db.$on("query", (e) => {
    logger.debug(e.query);
  });

  return db;
};

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;

export { throwNotFoundOrThrow, NotFoundError } from "./throwNotFoundOrThrow";
export * from "@prisma/client";
