import { createEnv } from "@t3-oss/env-core";
import { z } from "zod/v4";

export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    LOG_LEVEL: z.enum(["error", "warn", "info", "debug"]).default("info"),
    BACKEND_PORT: z.coerce.number().default(8080),
    BACKEND_MAX_TRUSTED_PROXIES: z.coerce.number(),
    WEBSITE_URL: z.url(),
    DATABASE_URL: z.string(),
    COOKIE_SECRET: z.string().min(32),
    DISCORD_CLIENT_ID: z.string(),
    DISCORD_CLIENT_SECRET: z.string(),
    DISCORD_OAUTH2_REDIRECT_URI: z.url(),
  },
  runtimeEnv: process.env,
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
