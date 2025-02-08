import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "production", "test"]),
    OTEL_SERVICE_NAME: z.string(),
    OTEL_SDK_DISABLED: z.coerce.boolean(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
