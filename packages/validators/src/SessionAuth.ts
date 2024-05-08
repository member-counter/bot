import { z } from "zod";

export interface SessionTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export const SessionAuthSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  expiresAt: z.number(),
});
