import type { AuthenticatedUser, Session, UserGuilds } from "@mc/validators";
import { REST } from "@discordjs/rest";
import { OAuth2Routes, Routes } from "discord-api-types/v10";

import {
  AuthenticatedUserSchema,
  DiscordOAuth2TokenExchangeResponseSchema,
  UserGuildsSchema,
} from "@mc/validators";

import { setSession } from "~/app/api/sessionCookie";
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
): Promise<Session> {
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

  const identifiedUser = await identify(tokenExchangeResponse.accessToken);

  return {
    userId: identifiedUser.id,
    ...tokenExchangeResponse,
  };
}

export async function identify(token: string): Promise<AuthenticatedUser> {
  const discordRESTClient = new REST({
    version: "10",
    authPrefix: "Bearer",
  }).setToken(token);

  const user = await discordRESTClient.get(Routes.user());

  return AuthenticatedUserSchema.parse(user);
}

export async function userGuilds(token: string): Promise<UserGuilds> {
  const discordRESTClient = new REST({
    version: "10",
    authPrefix: "Bearer",
  }).setToken(token);

  const guilds = await discordRESTClient.get(Routes.userGuilds(), {
    query: new URLSearchParams({ with_counts: "true" }),
  });

  return UserGuildsSchema.parse(guilds);
}

export async function refreshToken(
  session: Session | null,
): Promise<Session | null> {
  if (!session) return null;

  if (session.expiresAt < Date.now()) {
    session = await exchangeTokens({
      refreshToken: session.refreshToken,
    });

    await setSession(session);
  }

  return session;
}
