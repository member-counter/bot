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
    BOT_PRESENCE_ACTIVITY: z.string().transform((s) => {
      return z
        .array(
          z.object({
            name: z.string(),
            type: z.number().min(0).max(5),
            state: z.string().optional(),
            url: z.string().optional(),
          }),
        )
        .parse(JSON.parse(s));
    }),
    DBGG_TOKEN: z.string().optional(),
    DBL_TOKEN: z.string().optional(),
    BFD_TOKEN: z.string().optional(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
