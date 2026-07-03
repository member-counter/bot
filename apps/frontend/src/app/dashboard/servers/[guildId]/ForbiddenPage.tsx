import { BanIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTypedParams } from "react-router-typesafe-routes";
import invariant from "tiny-invariant";

import { routes } from "@mc/common/Routes";

import { useUserGuilds } from "~/lib/hooks/useUserGuilds";
import { MenuButton } from "../../Menu";

export function ForbiddenPage() {
  const { guildId } = useTypedParams(routes.dashboard.servers.server);
  invariant(guildId, "Expected guildId to be defined");
  const userGuildsQuery = useUserGuilds();

  const guild = userGuildsQuery.data.userGuilds.get(guildId);
  const [t] = useTranslation();

  return (
    <div className="flex h-full grow flex-col p-1">
      <MenuButton />
      <div className="m-auto flex flex-col items-center gap-2 p-3 sm:flex-row">
        <BanIcon className="mx-auto my-4 h-20 w-20 sm:mx-0 sm:my-0 sm:mr-2 sm:h-12 sm:w-12" />
        <p>
          {t("pages.dashboard.servers.forbiddenPage.message", {
            guildName: guild?.name ?? t("common.unknownServer"),
          })}
        </p>
      </div>
    </div>
  );
}
