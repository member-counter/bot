import { useTypedSearchParams } from "react-router-typesafe-routes";

import { botPermissions } from "@mc/common/bot/botPermissions";
import { generateInviteLink } from "@mc/common/generateInviteLink";
import { routes } from "@mc/common/Routes";

import { env } from "~/env";

export default function Page() {
  const [{ guildId }] = useTypedSearchParams(routes.invite);
  const inviteLink = generateInviteLink({
    clientId: env.VITE_DISCORD_CLIENT_ID,
    permissions: botPermissions,
    ...(guildId && { selectedGuild: guildId }),
  });

  window.location.replace(inviteLink);

  return null;
}
