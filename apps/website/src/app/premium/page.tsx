import { redirect, RedirectType } from "next/navigation";

import { env } from "~/env";

export default function Page() {
  redirect(env.NEXT_PUBLIC_SUPPORT_URL, RedirectType.replace);
}
