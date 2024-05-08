import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { redirect, RedirectType } from "next/navigation";

import { getOAuth2Url } from "~/server/auth";
import { catchErrors } from "../catchErrors";

export const GET = catchErrors((req: NextRequest) => {
  const redirectTo = req.nextUrl.searchParams.get("redirect_to");

  if (redirectTo) {
    cookies().set("redirect_to", redirectTo);
  }

  redirect(getOAuth2Url(), RedirectType.replace);
});
