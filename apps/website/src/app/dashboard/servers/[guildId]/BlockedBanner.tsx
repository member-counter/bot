import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ShieldBanIcon, XIcon } from "lucide-react";
import { Trans } from "react-i18next";

import { Button } from "@mc/ui/button";
import { LinkUnderlined } from "@mc/ui/LinkUnderlined";

import type { DashboardGuildParams } from "./layout";
import { Routes } from "~/other/routes";
import { api } from "~/trpc/react";

export function BlockedBanner() {
  const [closed, setClosed] = useState(false);
  const { guildId } = useParams<DashboardGuildParams>();
  const blockedState = api.guild.isBlocked.useQuery({
    discordGuildId: guildId,
  });

  useEffect(() => {
    setClosed(false);
  }, [blockedState.data]);

  if (!blockedState.isSuccess) return null;
  if (!blockedState.data) return null;
  if (closed) return null;

  const reason = blockedState.data.reason;

  return (
    <div className="flex w-full flex-row items-center bg-destructive p-1 text-xs">
      <div className="hidden items-center pl-2 pr-3 sm:flex">
        <ShieldBanIcon className="h-8 w-8" />
      </div>
      <div className="block pl-1">
        <Trans
          i18nKey="pages.dashboard.servers.blockedBanner.text"
          components={{
            LinkTerms: (
              <LinkUnderlined href={Routes.Legal("terms-of-service")} />
            ),
            LinkPolicy: (
              <LinkUnderlined href={Routes.Legal("acceptable-use-policy")} />
            ),
            SupportLink: <LinkUnderlined href={Routes.Support} />,
          }}
          values={{ reason: reason.trim().length ? reason : undefined }}
        />
      </div>

      <div className="flex grow items-center">
        <Button
          className="ml-auto"
          size={"icon"}
          variant={"none"}
          onClick={() => setClosed(true)}
        >
          <XIcon />
        </Button>
      </div>
    </div>
  );
}
