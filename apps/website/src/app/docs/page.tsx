import { redirect, RedirectType } from "next/navigation";

import { env } from "~/env";

export default function Page() {
  redirect(env.NEXT_PUBLIC_BOT_DOCS_URL, RedirectType.replace);
}
