import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "production", "test"]),
    DISCORD_CLIENT_ID: z.string(),
    DISCORD_BOT_TOKEN: z.string(),
    DISCORD_BOT_IS_PREMIUM: z
      .string()
      .toLowerCase()
      .transform((x) => x === "true")
      .pipe(z.boolean()),
    DISCORD_BOT_IS_PRIVILEGED: z
      .string()
      .toLowerCase()
      .transform((x) => x === "true")
      .pipe(z.boolean()),
    WEBSITE_URL: z.string(),
    NEXT_PUBLIC_BOT_REPO_URL: z.string(),
    NEXT_PUBLIC_SUPPORT_URL: z.string(),
    AUTO_DEPLOY_COMMANDS: z
      .string()
      .toLowerCase()
      .transform((x) => x === "true")
      .pipe(z.boolean()),
    DEPLOY_COMMANDS_TO_GUILD_ID: z.string().optional(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
