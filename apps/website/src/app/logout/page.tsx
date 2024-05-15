import { redirect, RedirectType } from "next/navigation";

export default function Page() {
  redirect("/api/auth/logout", RedirectType.push);
}
