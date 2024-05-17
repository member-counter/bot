import { BanIcon } from "lucide-react";

import { LinkUnderlined } from "@mc/ui/LinkUnderlined";

import { Routes } from "~/other/routes";
import { api } from "~/trpc/react";

interface Props {
  guildId: string;
}

export function BlockedBanner({ guildId }: Props) {
  const blockedState = api.guild.isBlocked.useQuery({
    discordGuildId: guildId,
  });

  if (!blockedState.isSuccess) return;
  if (!blockedState.data) return;

  const reason = blockedState.data.reason;

  return (
    <div className="flex w-full bg-destructive p-2">
      <div className="flex items-center pl-2 pr-4">
        <BanIcon className="h-10 w-10" />
      </div>
      <div className="">
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
      </div>
    </div>
  );
}
