import { useMemo } from "react";
import { useParams } from "next/navigation";

import { Separator } from "@mc/ui/separator";

import type { DashboardGuildChannelParams } from "../[channelId]/page";
import { api } from "~/trpc/react";
import { ChannelNavItem } from "./ChannelNavItem";
import { sortChannels } from "./sortChannels";

export function ServerNav() {
  const { guildId } = useParams<DashboardGuildChannelParams>();
  const guild = api.discord.getGuild.useQuery({ id: guildId });
  const channels = useMemo(
    () => sortChannels([...(guild.data?.channels.values() ?? [])]),
    [guild.data?.channels],
  );

  // TODO display saved channels if the discord channels are unable to load

  return (
    <div className="flex max-h-full w-[240px] flex-col overflow-hidden">
      <div className="ml-[16px] flex h-[48px] flex-shrink-0 items-center">
        <div className="max-w-[210px] overflow-clip text-ellipsis whitespace-nowrap font-semibold">
          {guild.data?.name}
        </div>
      </div>
      <Separator />
      <div className="flex max-h-full grow flex-col gap-1 overflow-auto p-[8px]">
        {channels.map((channel) => (
          <ChannelNavItem {...channel} key={channel.id} />
        ))}
        <div className="h-[1200px] flex-shrink-0"></div>
      </div>
    </div>
  );
}
