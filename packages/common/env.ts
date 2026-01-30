import { createEnv } from "@t3-oss/env-core";
import { z } from "zod/v4";

// @ts-expect-error - import.meta.env is not defined here
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const runtimeEnv: Record<string, string> = import.meta.env ?? process.env;

export const env = createEnv({
  shared: {
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
  },
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z.string(),
    DISCORD_CLIENT_ID: z.string(),
    DISCORD_CLIENT_SECRET: z.string(),
    DISCORD_OAUTH2_REDIRECT_URI: z.string(),
    MEMERATOR_API_KEY: z.string().optional(),
    TWITCH_CLIENT_ID: z.string().optional(),
    TWITCH_CLIENT_SECRET: z.string().optional(),
    YOUTUBE_API_KEY: z.string().optional(),
  },
  clientPrefix: "VITE_",
  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `VITE_`.
   */
  client: {
    VITE_SUPPORT_URL: z.string(),
    VITE_BOT_DOCS_URL: z.string(),
    VITE_BOT_REPO_URL: z.string(),
    VITE_TRANSLATION_PLATFORM_URL: z.string(),
  },

  runtimeEnv,
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!runtimeEnv.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
