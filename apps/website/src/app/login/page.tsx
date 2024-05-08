import { headers } from "next/headers";
import { redirect, RedirectType } from "next/navigation";

export default function Page() {
  let authPath = "/api/auth";

  const referer = headers().get("referer");

  if (referer) {
    const searchParams = new URLSearchParams();
    searchParams.set("redirect_to", referer);

    authPath += `?${searchParams.toString()}`;
  }

  redirect(authPath, RedirectType.push);
}
