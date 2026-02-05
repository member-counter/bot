import { useEffect } from "react";
import { useTypedSearchParams } from "react-router-typesafe-routes";

import { botPermissions } from "@mc/common/bot/botPermissions";
import { generateInviteLink } from "@mc/common/generateInviteLink";
import { routes } from "@mc/common/Routes";

import { api } from "~/lib/trpc";

export default function Page() {
  const [{ guildId }] = useTypedSearchParams(routes.invite);
  const trpc = api.useUtils();

  useEffect(() => {
    void (async () => {
      const inviteLink = generateInviteLink({
        clientId: await trpc.invite.botId.fetch(),
        permissions: botPermissions,
        ...(guildId && { selectedGuild: guildId }),
      });

      window.location.replace(inviteLink);
    })();
  }, [guildId, trpc.invite.botId]);

  return null;
}
