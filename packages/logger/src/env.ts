import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "production", "test"]),
    LOG_LEVEL: z.enum(["error", "warn", "info", "debug"]),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
