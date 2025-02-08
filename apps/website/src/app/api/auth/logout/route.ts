import { redirect, RedirectType } from "next/navigation";

import { Routes } from "~/other/routes";
import { catchErrors } from "../../catchErrors";
import { destroySession } from "../../sessionCookie";

export const dynamic = "force-dynamic";

export const GET = catchErrors(async () => {
  await destroySession();
  redirect(Routes.Home, RedirectType.replace);
});
