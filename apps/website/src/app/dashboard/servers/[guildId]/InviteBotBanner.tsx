import { BotIcon } from "lucide-react";

import { BitField } from "@mc/common/BitField";
import { LinkUnderlined } from "@mc/ui/LinkUnderlined";

import type { DashboardGuildPageProps } from "./layout";
import { Routes } from "~/other/routes";
import { api } from "~/trpc/react";

interface Props {
  guildId: string;
}

export function InviteBotBanner({ guildId }: Props) {
  const authenticatedUser = api.session.user.useQuery();

  const authenticatedUserPermissions = new BitField(
    authenticatedUser.data?.permissions,
  );

  const guild = api.discord.getGuild.useQuery(
    { id: guildId },
    { enabled: !authenticatedUser.data },
  );

  if (guild.isSuccess) return;

  return (
    <div className="flex w-full bg-primary p-2">
      <div className="flex items-center pl-1 pr-2">
        <BotIcon className="h-6 w-6" />
      </div>
      <div className="flex items-center">
        Seems like Member Counter is not installed on this server. Would you
        like to&nbsp;
        <LinkUnderlined href={Routes.Invite(guildId)} target="_blank">
          install it
        </LinkUnderlined>
        ?
      </div>
    </div>
  );
}
