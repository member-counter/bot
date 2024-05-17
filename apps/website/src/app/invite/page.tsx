import { redirect, RedirectType } from "next/navigation";

import { botPermissions } from "@mc/common/botPermissions";
import { generateInviteLink } from "@mc/common/generateInviteLink";

import { env } from "~/env";

interface Props {
  searchParams: { guildId?: string };
}

export default function Page(props: Props) {
  const guildId = props.searchParams.guildId;
  redirect(
    generateInviteLink({
      clientId: env.DISCORD_CLIENT_ID,
      permissions: botPermissions,
      ...(guildId && { selectedGuild: guildId }),
    }),
    RedirectType.replace,
  );
}
