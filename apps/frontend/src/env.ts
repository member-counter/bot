import { createEnv } from "@t3-oss/env-core";
import { z } from "zod/v4";

export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
  },
  clientPrefix: "VITE_",
  client: {
    VITE_SUPPORT_URL: z.string().default("https://discord.com/invite/g4MfV6N"),
    VITE_BOT_DOCS_URL: z.string().default("https://docs.membercounter.app/"),
    VITE_BOT_REPO_URL: z
      .string()
      .default("https://github.com/member-counter/bot"),
    VITE_TRANSLATION_PLATFORM_URL: z
      .string()
      .default("https://tolgee.membercounter.app/"),
  },

  runtimeEnv: import.meta.env,
  skipValidation: !!import.meta.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
