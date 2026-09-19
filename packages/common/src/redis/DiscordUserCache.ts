import { z } from "zod";

export type CachedDiscordUser = z.infer<typeof CachedDiscordUserValidator>;
export const CachedDiscordUserValidator = z.object({
  id: z.string(),
  username: z.string(),
  discriminator: z.string(),
  avatar: z.string(),
});

export const DISCORD_USER_CACHE_TTL = 60 * 60 * 24; // 24 hours
