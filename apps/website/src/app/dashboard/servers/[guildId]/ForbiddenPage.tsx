import { useParams } from "next/navigation";
import { BanIcon } from "lucide-react";

import type { DashboardGuildParams } from "./layout";
import { api } from "~/trpc/react";
import { MenuButton } from "../../Menu";

export function ForbiddenPage() {
  const { guildId } = useParams<DashboardGuildParams>();
  const userGuildsQuery = api.discord.userGuilds.useQuery(undefined, {
    initialData: () => ({ userGuilds: new Map() }),
  });

  const guild = userGuildsQuery.data.userGuilds.get(guildId);

  return (
    <div className="flex h-full grow flex-col p-1">
      <MenuButton />
      <div className="m-auto flex flex-col gap-2 p-3 sm:flex-row">
        <BanIcon className="mx-auto my-4 h-20 w-20 sm:mx-0 sm:my-0 sm:mr-2 sm:h-12 sm:w-12" />
        You don't have permission to manage this server. <br />
        Ask an admin at {guild?.name ?? "Unknown server"} to give you
        Administrator or Manage Guild permissions.
      </div>
    </div>
  );
}
