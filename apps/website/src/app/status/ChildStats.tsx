import type { TFunction } from "i18next";
import { CornerDownRightIcon, MemoryStickIcon, UserIcon } from "lucide-react";
import prettyBytes from "pretty-bytes";
import { useTranslation } from "react-i18next";

import { WSStatus } from "@mc/common/redis/BotStats";
import { cn } from "@mc/ui";

import type { RouterOutputs } from "~/trpc/react";
import { api } from "~/trpc/react";
import { InfoToolip } from "../components/InfoTooltip";
import { GroupIcon } from "./assets/GroupIcon";
import { ChildStatsDiscordServers } from "./ChildStatsServers";
import { ServerInfo } from "./ServerInfo";

type ChildStats = NonNullable<
  RouterOutputs["bot"]["getStatus"][number]["stats"]
>[number];

const getWSStatusLabels = (t: TFunction) =>
  ({
    [WSStatus.Ready]: t("pages.status.discordClientStatus.Ready"),
    [WSStatus.Connecting]: t("pages.status.discordClientStatus.Connecting"),
    [WSStatus.Reconnecting]: t("pages.status.discordClientStatus.Reconnecting"),
    [WSStatus.Idle]: t("pages.status.discordClientStatus.Idle"),
    [WSStatus.Nearly]: t("pages.status.discordClientStatus.Nearly"),
    [WSStatus.Disconnected]: t("pages.status.discordClientStatus.Disconnected"),
    [WSStatus.WaitingForGuilds]: t(
      "pages.status.discordClientStatus.WaitingForGuilds",
    ),
    [WSStatus.Identifying]: t("pages.status.discordClientStatus.Identifying"),
    [WSStatus.Resuming]: t("pages.status.discordClientStatus.Resuming"),
  }) satisfies Record<ChildStats["clientStatus"], string>;

const getWSStatusColor = (status: ChildStats["clientStatus"]) => {
  if (status === WSStatus.Ready) return "bg-green-500";
  else if (status === WSStatus.Idle || status === WSStatus.WaitingForGuilds)
    return "bg-blue-500";
  else if (status === WSStatus.Disconnected) return "bg-red-500";
  else return "bg-ambar-500";
};

export function ChildStats(stats: ChildStats) {
  const { t, i18n } = useTranslation();
  const {
    data: { userGuilds },
  } = api.discord.userGuilds.useQuery(undefined, {
    initialData: () => ({ userGuilds: new Map() }),
  });

  const assignedGuilds = [...userGuilds.entries()]
    .filter(([guildId]) =>
      stats.shards.some(
        (shard) =>
          (BigInt(guildId) >> 22n) % BigInt(stats.shardCount) === BigInt(shard),
      ),
    )
    .map(([_, guild]) => guild);

  return (
    <div className="overflow-hidden rounded-sm border border-border bg-popover">
      <div className="flex">
        <div className="z-10 flex h-7 items-center rounded-br-sm border-b border-r border-border bg-card px-2 text-xs">
          {t("pages.status.child", { index: stats.childId })}
        </div>
        <div
          className={cn(
            "relative left-[-4px] z-0 flex h-7 items-center rounded-br-sm border-b border-r pl-3 pr-2 text-xs",
            getWSStatusColor(stats.clientStatus),
          )}
        >
          {getWSStatusLabels(t)[stats.clientStatus]}
        </div>
        <div className="grow"></div>
        <InfoToolip text={t("pages.status.memoryUsageTooltip")}>
          <div className="flex h-7 items-center p-1 text-xs">
            <MemoryStickIcon className="mr-1 h-4 w-4" />
            {t("pages.status.memoryUsage", {
              usage: prettyBytes(stats.memory.rss, {
                locale: i18n.language,
              }),
              peak: prettyBytes(stats.memory.maxrss, { locale: i18n.language }),
            })}
          </div>
        </InfoToolip>
        <div className="h-7 w-7 overflow-hidden rounded-bl-md border-b border-l border-border">
          <ServerInfo {...stats} />
        </div>
      </div>
      <div className="p-4">
        <div>
          <UserIcon className="mr-1 inline h-4 w-4 " />
          {t("pages.status.childDiscordUsers", { count: stats.userCount })}
        </div>
        <div>
          <GroupIcon className="mr-1 inline h-4 w-4 " />
          {t("pages.status.childDiscordServers", {
            count: stats.guildCount,
            unavailableCount: stats.unavailableGuildCount,
          })}
        </div>
        {!!assignedGuilds.length && (
          <>
            <CornerDownRightIcon className="mr-1 inline h-4 w-4 " />
            {t("pages.status.assignedDiscordServers")}
            <ChildStatsDiscordServers
              className="bg-card"
              assignedGuilds={assignedGuilds}
            />
          </>
        )}
      </div>
    </div>
  );
}
