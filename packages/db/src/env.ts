import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string(),
    NODE_ENV: z.enum(["development", "production", "test"]),
    LOG_LEVEL: z.enum(["error", "warn", "info", "debug"]).default("info"),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
