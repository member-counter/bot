import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "production", "test"]),
    WEBSITE_URL: z.string(),
    NEXT_PUBLIC_BOT_REPO_URL: z.string(),
    NEXT_PUBLIC_SUPPORT_URL: z.string(),
    DISCORD_CLIENT_ID: z.string(),
    MAIN_DISCORD_CLIENT_ID: z.string(),
    DISCORD_BOT_INSTANCE_TOKEN: z.string(),
    DISCORD_BOT_INSTANCE_ID: z.string(),
    DISCORD_BOT_INSTANCE_CHILD_ID: z.string(),
    DISCORD_BOT_INSTANCE_SHARDING_SHARDS: z.string().transform((s) => {
      const parsed = JSON.parse(s);
      if (Array.isArray(parsed)) {
        return z.array(z.number().min(0)).min(1).parse(parsed);
      } else if (typeof parsed === "number" && parsed >= 0) {
        return [parsed];
      } else {
        throw new Error(
          "Invalid input: must be a stringified array of numbers or a single number.",
        );
      }
    }),
    DISCORD_BOT_INSTANCE_SHARDING_SHARD_COUNT: z.coerce.number(),
    DISCORD_BOT_INSTANCE_SHARDING_SHARD_MAX_CONCURRENCY: z.coerce.number(),
    DISCORD_BOT_INSTANCE_COMPUTE_PRIORITY: z.coerce.number(),
    DISCORD_BOT_INSTANCE_DISCORD_API_RPS: z.coerce.number(),
    DISCORD_BOT_INSTANCE_IS_PRIVILEGED: z
      .string()
      .toLowerCase()
      .transform((x) => x === "true")
      .pipe(z.boolean()),
    DISCORD_BOT_INSTANCE_IS_PREMIUM: z
      .string()
      .toLowerCase()
      .transform((x) => x === "true")
      .pipe(z.boolean()),
    DISCORD_BOT_INSTANCE_DEPLOY_COMMANDS: z
      .string()
      .toLowerCase()
      .transform((x) => {
        const parsed = JSON.parse(x);
        if (typeof parsed === "boolean") return parsed;
        else return x;
      })
      .pipe(z.string().or(z.boolean())),
    DISCORD_BOT_INSTANCE_BOT_PRESENCE_ACTIVITY: z.string().transform((s) => {
      return z
        .array(
          z
            .object({
              name: z.string(),
              type: z.number().min(0).max(5),
              state: z.string().optional().nullable(),
              url: z.string().optional().nullable(),
            })
            .transform((activity) => {
              return {
                name: activity.name,
                type: activity.type,
                ...(activity.state && { state: activity.state }),
                ...(activity.url && { url: activity.url }),
              };
            }),
        )
        .parse(JSON.parse(s));
    }),
    DISCORD_BOT_INSTANCE_BOT_STATUS: z.enum([
      "online",
      "idle",
      "dnd",
      "invisible",
    ]),
    DISCORD_BOT_INSTANCE_STATS_DBGG_TOKEN: z.string().optional(),
    DISCORD_BOT_INSTANCE_STATS_DBL_TOKEN: z.string().optional(),
    DISCORD_BOT_INSTANCE_STATS_BFD_TOKEN: z.string().optional(),
    LOG_LEVEL: z.enum(["error", "warn", "info", "debug"]).default("info"),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
