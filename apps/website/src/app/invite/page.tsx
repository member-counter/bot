import { redirect, RedirectType } from "next/navigation";

import { botPermissions, generateInviteLink } from "@mc/common";

import { env } from "~/env";

export default function Page() {
  redirect(
    generateInviteLink({
      clientId: env.DISCORD_CLIENT_ID,
      permissions: botPermissions,
    }),
    RedirectType.replace,
  );
}
