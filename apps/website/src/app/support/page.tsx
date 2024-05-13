import { redirect, RedirectType } from "next/navigation";

export default function Page() {
  redirect("/donors", RedirectType.replace);
}
