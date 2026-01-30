import type { Session } from "@mc/validators/Session";
import type { Request, Response } from "express";
import { sealData, unsealData } from "iron-session";
import { z } from "zod/v4";

import logger from "@mc/logger";
import { SessionSchema } from "@mc/validators/Session";

import { env } from "~/env";

export const cookieName = "session";

/**
 * Get the session from the request cookies.
 * Returns null if no session exists or if it's invalid.
 */
export async function getSession(req: Request): Promise<Session | null> {
  const sessionCookie = z.string().optional().parse(req.cookies[cookieName]);

  if (!sessionCookie) return null;

  try {
    const unsealed = await unsealData(sessionCookie, {
      password: env.COOKIE_SECRET,
    });

    return SessionSchema.parse(unsealed);
  } catch (err) {
    logger.error("Error unsealing session cookie:", err);
    return null;
  }
}

/**
 * Set the session cookie in the response.
 */
export async function setSession(res: Response, session: Session) {
  const sealed = await sealData(session, {
    password: env.COOKIE_SECRET,
  });

  res.cookie(cookieName, sealed, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  });
}

/**
 * Destroy the session cookie.
 */
export function destroySession(res: Response) {
  res.clearCookie(cookieName);
}
