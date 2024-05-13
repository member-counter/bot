import { redirect, RedirectType } from "next/navigation";

import { botPermissions } from "@mc/common/botPermissions";
import { generateInviteLink } from "@mc/common/generateInviteLink";

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
