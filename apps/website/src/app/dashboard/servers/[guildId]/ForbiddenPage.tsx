import { useParams } from "next/navigation";
import { BanIcon } from "lucide-react";

import type { DashboardGuildParams } from "./layout";
import { api } from "~/trpc/react";

export function ForbiddenPage() {
  const { guildId } = useParams<DashboardGuildParams>();
  const userGuilds = api.discord.userGuilds.useQuery();
  const guild = userGuilds.data?.get(guildId);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-4">
      <div className="flex flex-col gap-2 sm:flex-row">
        <BanIcon className="mx-auto my-4 h-20 w-20 sm:mx-0 sm:my-0 sm:mr-2 sm:h-12 sm:w-12" />
        You don't have permission to manage this server. <br />
        Ask an admin at {guild?.name ?? "Unknown server"} to give you
        Administrator or Manage Guild permissions.
      </div>
    </div>
  );
}
