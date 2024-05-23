import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "production", "test"]),
    BDE_CALL_TIMEOUT: z.coerce.number().default(2000),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
