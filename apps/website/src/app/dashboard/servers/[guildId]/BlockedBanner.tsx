import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { BanIcon, XIcon } from "lucide-react";

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

  if (!blockedState.isSuccess) return;
  if (!blockedState.data) return;
  if (closed) return;

  const reason = blockedState.data.reason;
  return (
    <div className="flex w-full flex-row items-center bg-destructive p-1 text-xs">
      <div className="hidden items-center pl-2 pr-3 sm:flex">
        <BanIcon className="h-8 w-8" />
      </div>
      <div className="block pl-1">
        <p>
          This server has been blocked for violating our{" "}
          <LinkUnderlined href={Routes.Legal("terms-of-service")}>
            Terms of conditions
          </LinkUnderlined>{" "}
          or{" "}
          <LinkUnderlined href={Routes.Legal("acceptable-use-policy")}>
            Acceptable Use Policy
          </LinkUnderlined>
          .
          <br />
          Reason given: {reason.trim().length ? reason : "No reason given"}
          <br />
          If you think this is a mistake, please contact our{" "}
          <LinkUnderlined href={Routes.Support}>support team</LinkUnderlined>.
        </p>
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
