import { z } from "zod";

export const DiscordOAuth2TokenExchangeResponseSchema = z.union([
  z.object({ error: z.string() }),
  z
    .object({
      token_type: z.string(),
      access_token: z.string(),
      refresh_token: z.string(),
      expires_in: z.number(),
      scope: z.string().transform((s) => s.split(" ")),
    })
    .transform(
      ({ access_token, expires_in, refresh_token, scope, token_type }) => ({
        tokenType: token_type,
        accessToken: access_token,
        refreshToken: refresh_token,
        expiresAt: Date.now() + expires_in * 1000,
        scope: scope,
      }),
    )]);
