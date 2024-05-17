import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { Routes } from "~/other/routes";
import { exchangeTokens } from "~/server/auth";
import { catchErrors, UserHttpError } from "../../catchErrors";
import { setSession } from "../../sessionCookie";

export const dynamic = "force-dynamic";

export const GET = catchErrors(async (req: NextRequest) => {
  const code = req.nextUrl.searchParams.get("code");

  if (!code) throw new UserHttpError("No code parameter provided", 400);

  const sessionTokens = await exchangeTokens({ code });
  await setSession(sessionTokens);

  const redirectTo = cookies().get("redirect_to");
  if (redirectTo) {
    cookies().delete("redirect_to");
    redirect(redirectTo.value);
  } else {
    redirect(Routes.Home);
  }
});
