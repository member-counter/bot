import type { AuthUser, SessionTokens } from "@mc/validators";
import { REST } from "@discordjs/rest";
import { OAuth2Routes, Routes } from "discord-api-types/v10";

import {
  AuthUserSchema,
  DiscordOAuth2TokenExchangeResponseSchema,
} from "@mc/validators";

import { getSession, setSession } from "~/app/api/sessionCookie";
import { env } from "~/env";

const requiredScopes = ["identify", "guilds"];

function basicAuth(id: string, pass: string) {
  return `Basic ${Buffer.from(`${id}:${pass}`).toString("base64")}`;
}

export function getOAuth2Url() {
  const oauth2Url = new URL(OAuth2Routes.authorizationURL);

  oauth2Url.searchParams.set("client_id", env.DISCORD_CLIENT_ID);
  oauth2Url.searchParams.set("response_type", "code");
  oauth2Url.searchParams.set("scope", requiredScopes.join(" "));
  oauth2Url.searchParams.set("redirect_uri", env.DISCORD_OAUTH2_REDIRECT_URI);
  oauth2Url.searchParams.set("prompt", "none");

  return oauth2Url.toString();
}

export async function exchangeTokens(
  exchangeMethod:
    | {
        code: string;
      }
    | {
        refreshToken: string;
      },
): Promise<SessionTokens> {
  let body = {};
  if ("code" in exchangeMethod) {
    body = {
      grant_type: "authorization_code",
      code: exchangeMethod.code,
      redirect_uri: env.DISCORD_OAUTH2_REDIRECT_URI,
    };
  } else {
    body = {
      grant_type: "refresh_token",
      refresh_token: exchangeMethod.refreshToken,
    };
  }

  const tokenExchangeResponse = await fetch(OAuth2Routes.tokenURL, {
    method: "post",
    headers: {
      Authorization: basicAuth(
        env.DISCORD_CLIENT_ID,
        env.DISCORD_CLIENT_SECRET,
      ),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(body),
  })
    .then((res) => res.json())
    .then((res) => DiscordOAuth2TokenExchangeResponseSchema.parse(res));

  if (tokenExchangeResponse.tokenType !== "Bearer")
    throw new Error("Unknown access token type");

  if (!requiredScopes.every((s) => tokenExchangeResponse.scope.includes(s)))
    throw new Error("Inssuficient scope");

  return tokenExchangeResponse;
}

export async function identify(token: string): Promise<AuthUser> {
  const discordRESTClient = new REST({
    version: "10",
    authPrefix: "Bearer",
  }).setToken(token);

  const user = await discordRESTClient.get(Routes.user());

  return AuthUserSchema.parse(user);
}

export async function authenticateSession(): Promise<AuthUser | null> {
  let sessionTokens = await getSession();
  if (!sessionTokens) return null;

  if (sessionTokens.expiresAt < Date.now()) {
    sessionTokens = await exchangeTokens({
      refreshToken: sessionTokens.refreshToken,
    });

    await setSession(sessionTokens);
  }

  return await identify(sessionTokens.accessToken);
}
