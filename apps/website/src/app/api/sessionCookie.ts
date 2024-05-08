import { cookies } from "next/headers";
import { sealData, unsealData } from "iron-session";

import type { SessionTokens } from "@mc/validators";
import { SessionAuthSchema } from "@mc/validators";

import { env } from "~/env";

const cookieName = "session";

export async function getSession(): Promise<SessionTokens | null> {
  const session = cookies().get(cookieName);

  if (!session) return null;

  const unsealed = await unsealData(session.value, {
    password: env.COOKIE_SECRET,
  });

  return SessionAuthSchema.parse(unsealed);
}

export async function setSession(sessionTokens: SessionTokens) {
  const sealedSessionTokens = await sealData(sessionTokens, {
    password: env.COOKIE_SECRET,
  });

  cookies().set({
    name: cookieName,
    value: sealedSessionTokens,
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });
}

export function destroySession() {
  cookies().delete(cookieName);
}
