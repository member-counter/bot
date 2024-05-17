import { BotIcon } from "lucide-react";

import { LinkUnderlined } from "@mc/ui/LinkUnderlined";

import { Routes } from "~/other/routes";
import { api } from "~/trpc/react";

interface Props {
  guildId: string;
}

export function InviteBotBanner({ guildId }: Props) {
  const authenticatedUser = api.session.user.useQuery();

  const discordGuild = api.discord.getGuild.useQuery(
    { id: guildId },
    { enabled: !authenticatedUser.data },
  );

  if (discordGuild.isPending || discordGuild.data) return;

  return (
    <div className="flex w-full bg-primary p-2">
      <div className="flex items-center pl-1 pr-2">
        <BotIcon className="h-6 w-6" />
      </div>
      <div className="flex items-center">
        Seems like Member Counter Bot isn't in this server. Would you like
        to&nbsp;
        <LinkUnderlined href={Routes.Invite(guildId)} target="_blank">
          add it
        </LinkUnderlined>
        ?
      </div>
    </div>
  );
}
