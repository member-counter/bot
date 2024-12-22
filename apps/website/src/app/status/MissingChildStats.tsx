import { AlertCircleIcon, CornerDownRightIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { api } from "~/trpc/react";
import { ChildStatsDiscordServers } from "./ChildStatsServers";

interface MissingChildStats {
  missingShards: number[];
  shardCount: number;
}

export function MissingChildStats(props: MissingChildStats) {
  const { t } = useTranslation();
  const {
    data: { userGuilds },
  } = api.discord.userGuilds.useQuery(undefined, {
    initialData: () => ({ userGuilds: new Map() }),
  });

  const assignedGuilds = [...userGuilds.entries()]
    .filter(([guildId]) =>
      props.missingShards.some(
        (shard) =>
          (BigInt(guildId) >> 22n) % BigInt(props.shardCount) === BigInt(shard),
      ),
    )
    .map(([_, guild]) => guild);

  return (
    <article className="flex flex-col overflow-hidden rounded-sm bg-red-700">
      <div className="flex grow items-center justify-center">
        <h1 className="flex items-center gap-2 text-xl">
          <AlertCircleIcon className="inline" />{" "}
          {t("pages.status.partialOutage")}
        </h1>
      </div>
      <div className="p-4 pt-0">
        {!!assignedGuilds.length && (
          <div>
            <CornerDownRightIcon className="mr-1 inline h-4 w-4" />
            {t("pages.status.affectedServers")}
            <ChildStatsDiscordServers
              className="border-popover-foreground/50"
              assignedGuilds={assignedGuilds}
            />
          </div>
        )}
      </div>
    </article>
  );
}
