import { redirect, RedirectType } from "next/navigation";

import { Routes } from "~/other/routes";

export default function Page() {
  redirect(Routes.Dashboard, RedirectType.replace);
}
