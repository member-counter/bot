import { useMemo } from "react";
import { useParams } from "next/navigation";
import { ChannelType } from "discord-api-types/v10";

import type { DashboardGuildChannelParams } from "../[channelId]/page";
import type { DashboardGuildParams } from "../layout";
import { api } from "~/trpc/react";

export function ServerNav() {
  const { guildId, channelId } = useParams<DashboardGuildChannelParams>();
  const guild = api.discord.getGuild.useQuery({ id: guildId });
  const channels = useMemo(
    () => [...(guild.data?.channels.values() ?? [])],
    [guild.data?.channels],
  );
  // TODO display saved channels when the discord channels are not loaded yet
  return (
    <div className="max-h-full w-[224px] flex-shrink-0 gap-0.5 overflow-auto p-[8px]">
      {channels.map((channel) => (
        <ChannelItem {...channel} />
      ))}
    </div>
  );
}

function ChannelItem(channel: { id: string; type: ChannelType; name: string }) {
  const isSupported = true;
  const isCategory = channel.type === ChannelType.GuildCategory;
  return (
    <div className="rounded-sm px-2 py-1.5 hover:bg-accent">{channel.name}</div>
  );
}
