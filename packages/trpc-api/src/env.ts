import { createEnv } from "@t3-oss/env-core";
import { z } from "zod/v4";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "production", "test"]),
    PUBLIC_BOTS_IDS: z.string().transform((s) => {
      return z.string().array().parse(JSON.parse(s));
    }),
    DISCORD_CLIENT_ID: z.string(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
