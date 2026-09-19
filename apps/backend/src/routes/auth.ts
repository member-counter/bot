import crypto from "node:crypto";
import type { Request, Response } from "express";
import { Router } from "express";
import z from "zod/v4";

import logger from "@mc/logger";

import { exchangeTokens, getOAuth2Url } from "~/auth/oauth";
import { env } from "~/env";
import { destroySession, setSession } from "~/session";

const router = Router();

const redirectToCookieName = "redirect_to";
const oauthStateCookieName = "oauth_state";

/**
 * GET /api/auth
 * Redirects to Discord OAuth2 authorization.
 */
router.get("/", (req: Request, res: Response) => {
  const redirectTo = z.string().optional().parse(req.query.redirect_to);

  // Store redirect_to in a cookie if provided
  if (redirectTo) {
    res.cookie(redirectToCookieName, redirectTo, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 15, // 15 minutes
    });
  }

  const state = crypto.randomBytes(32).toString("hex");
  res.cookie(oauthStateCookieName, state, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 1000 * 60 * 15, // 15 minutes
  });

  const oauth2Url = getOAuth2Url(state);
  res.redirect(oauth2Url);
});

/**
 * GET /api/auth/callback
 * OAuth2 callback endpoint.
 */
router.get("/callback", async (req: Request, res: Response) => {
  const code = z.string().parse(req.query.code);
  const state = z.string().parse(req.query.state);
  const storedState = z.string().parse(req.cookies[oauthStateCookieName]);

  res.clearCookie(oauthStateCookieName);

  if (!crypto.timingSafeEqual(Buffer.from(state), Buffer.from(storedState))) {
    throw new Error("Invalid OAuth2 state");
  }

  try {
    const session = await exchangeTokens({ code });
    await setSession(res, session);

    // Get redirect destination
    const redirectTo = z
      .string()
      .optional()
      .parse(req.cookies[redirectToCookieName]);

    res.clearCookie(redirectToCookieName);

    let parsed = new URL(redirectTo ?? "/", env.WEBSITE_URL);
    if (parsed.origin !== new URL(env.WEBSITE_URL).origin) {
      parsed = new URL("/", env.WEBSITE_URL);
    }
    res.redirect(parsed.toString());
  } catch (error) {
    logger.error("OAuth2 callback error:", error);
    throw new Error("Authentication failed");
  }
});

/**
 * GET /api/auth/logout
 * Logout endpoint.
 */
router.get("/logout", (req: Request, res: Response) => {
  destroySession(res);
  res.redirect(env.WEBSITE_URL);
});

export default router;
