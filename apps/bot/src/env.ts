import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "production", "test"]),
    DISCORD_BOT_TOKEN: z.string(),
    DISCORD_BOT_IS_PREMIUM: z.coerce.boolean(),
    DISCORD_BOT_IS_PRIVILEGED: z.coerce.boolean(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
