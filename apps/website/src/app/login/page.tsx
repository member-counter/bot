import { headers } from "next/headers";
import { redirect, RedirectType } from "next/navigation";

import { Routes } from "~/other/routes";

export default async function Page() {
  const referer = (await headers()).get("referer") ?? undefined;
  const authPath = Routes.ApiLogin(referer);
  redirect(authPath, RedirectType.push);
}
