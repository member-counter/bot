import type { Session } from "@mc/validators/Session";
import { cookies } from "next/headers";
import { sealData, unsealData } from "iron-session";

import { SessionSchema } from "@mc/validators/Session";

import { env } from "~/env";

const cookieName = "session";

export async function getSession(): Promise<Session | null> {
  const session = cookies().get(cookieName);

  if (!session) return null;

  const unsealed = await unsealData(session.value, {
    password: env.COOKIE_SECRET,
  });

  try {
    return SessionSchema.parse(unsealed);
  } catch (err) {
    console.error(err);
    destroySession();
    return null;
  }
}

export async function setSession(sessionTokens: Session) {
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
