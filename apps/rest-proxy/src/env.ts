import { createEnv } from "@t3-oss/env-core";
import { z } from "zod/v4";

export const env = createEnv({
  server: {
    DISCORD_BOT_INSTANCE_TOKEN: z.string(),
    REST_PROXY_PORT: z.coerce.number().default(8765),
  },
  runtimeEnv: process.env,
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
