import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { BotIcon, XIcon } from "lucide-react";

import { Button } from "@mc/ui/button";
import { LinkUnderlined } from "@mc/ui/LinkUnderlined";

import type { DashboardGuildParams } from "./layout";
import { Routes } from "~/other/routes";
import { api } from "~/trpc/react";

export function InviteBotBanner() {
  const [closed, setClosed] = useState(false);
  const { guildId } = useParams<DashboardGuildParams>();
  const authenticatedUser = api.session.user.useQuery();

  const discordGuild = api.discord.getGuild.useQuery(
    { id: guildId },
    { enabled: !authenticatedUser.data },
  );

  useEffect(() => {
    setClosed(false);
  }, [discordGuild.data]);

  if (discordGuild.isPending || discordGuild.data) return;
  if (closed) return;

  return (
    <div className="flex w-full flex-row bg-primary p-1 text-xs">
      <div className="flex items-center pl-1 pr-2">
        <BotIcon className="h-5 w-5" />
      </div>
      <div className="flex items-center">
        <p>
          Seems like Member Counter Bot isn't in this server. Would you like
          to&nbsp;
          <LinkUnderlined href={Routes.Invite(guildId)} target="_blank">
            add it
          </LinkUnderlined>
          ?
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
