import { useCallback, useEffect } from "react";
import { useTypedSearchParams } from "react-router-typesafe-routes";

import { botPermissions } from "@mc/common/bot/botPermissions";
import { generateInviteLink } from "@mc/common/generateInviteLink";
import { routes } from "@mc/common/Routes";

import { api } from "~/lib/trpc";

export default function Page() {
  const [{ guildId }] = useTypedSearchParams(routes.invite);
  const trpc = api.useUtils();

  const getClientId = useCallback(
    async () => (await trpc.env.fetch()).DISCORD_CLIENT_ID,
    [trpc.env],
  );

  useEffect(() => {
    void (async () => {
      const inviteLink = generateInviteLink({
        clientId: await getClientId(),
        permissions: botPermissions,
        ...(guildId && { selectedGuild: guildId }),
      });

      window.location.replace(inviteLink);
    })();
  }, [getClientId, guildId]);

  return null;
}
