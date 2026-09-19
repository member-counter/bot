import { createEnv } from "@t3-oss/env-core";
import { z } from "zod/v4";

export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    LOG_LEVEL: z.enum(["error", "warn", "info", "debug"]).default("info"),
    DATABASE_URL: z.string(),
    DISCORD_CLIENT_ID: z.string(),
    DISCORD_CLIENT_SECRET: z.string(),
    DISCORD_OAUTH2_REDIRECT_URI: z.string(),
    MEMERATOR_API_KEY: z.string().optional(),
    TWITCH_CLIENT_ID: z.string().optional(),
    TWITCH_CLIENT_SECRET: z.string().optional(),
    YOUTUBE_API_KEY: z.string().optional(),
    BDE_CALL_TIMEOUT: z.coerce.number().default(2000),
    OPENEXCHANGERATESORG_KEY: z.string().optional(),
  },
  runtimeEnv: process.env,
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
