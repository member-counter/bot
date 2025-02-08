import { redirect, RedirectType } from "next/navigation";

import { botPermissions } from "@mc/common/botPermissions";
import { generateInviteLink } from "@mc/common/generateInviteLink";

import { env } from "~/env";

interface Props {
  searchParams: Promise<{ guildId?: string }>;
}

export default async function Page(props: Props) {
  const guildId = (await props.searchParams).guildId;
  redirect(
    generateInviteLink({
      clientId: env.DISCORD_CLIENT_ID,
      permissions: botPermissions,
      ...(guildId && { selectedGuild: guildId }),
    }),
    RedirectType.replace,
  );
}
