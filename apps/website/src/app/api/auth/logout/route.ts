import { redirect, RedirectType } from "next/navigation";

import { catchErrors } from "../../catchErrors";
import { destroySession } from "../../sessionCookie";

export const dynamic = "force-dynamic";

export const GET = catchErrors(() => {
  destroySession();
  redirect("/.", RedirectType.replace);
});
