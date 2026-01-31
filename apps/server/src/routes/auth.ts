import type { Request, Response } from "express";
import { Router } from "express";
import z from "zod/v4";

import logger from "@mc/logger";

import { exchangeTokens, getOAuth2Url } from "~/auth/oauth";
import { env } from "~/env";
import { destroySession, setSession } from "~/session";

const router = Router();

const redirectToCookieName = "redirect_to";

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

  const oauth2Url = getOAuth2Url();
  res.redirect(oauth2Url);
});

/**
 * GET /api/auth/callback
 * OAuth2 callback endpoint.
 */
router.get("/callback", async (req: Request, res: Response) => {
  const code = z.string().parse(req.query.code);

  try {
    const session = await exchangeTokens({ code });
    await setSession(res, session);

    // Get redirect destination
    const redirectTo = z
      .string()
      .optional()
      .parse(req.cookies[redirectToCookieName]);

    res.clearCookie(redirectToCookieName);

    const redirectUrl = redirectTo ?? "/";
    res.redirect(new URL(redirectUrl, env.WEBSITE_URL).toString());
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
