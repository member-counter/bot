"use client";

import type { LucideIcon } from "lucide-react";
import { ChannelType } from "discord-api-types/v10";
import { BookTextIcon, FolderIcon, HelpCircleIcon } from "lucide-react";

import { Separator } from "@mc/ui/separator";

import type { DashboardGuildParams } from "../layout";
import { api } from "~/trpc/react";
import { MenuButton } from "../../../MenuButton";
import { ChannelIconMap, ChannelLabelMap } from "../ChannelMaps";

export type DashboardGuildChannelParams = {
  channelId: string;
} & DashboardGuildParams;

interface Props {
  params: DashboardGuildChannelParams;
  children: React.ReactNode;
}

export default function Layout(props: Props) {
  const { channelId, guildId } = props.params;
  const guild = api.discord.getGuild.useQuery({ id: guildId });
  const channel = guild.data?.channels.get(channelId);

  let Icon: LucideIcon | undefined;
  if (channel) Icon = ChannelIconMap[channel.type];
  if (channel?.type === ChannelType.GuildCategory) Icon = FolderIcon;
  if (channel?.id === guild.data?.rulesChannelId) Icon = BookTextIcon;
  Icon ??= HelpCircleIcon;

  let label: string | undefined;
  if (channel) label = ChannelLabelMap[channel.type];
  label ??= "Uknown channel type";

  const name = channel?.name ?? "Unknown channel name";

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-[48px] w-full flex-shrink-0 flex-row items-center pl-3 pr-1 font-semibold">
        <Icon className="mr-3 h-5 w-5" aria-label={label} />
        <h1 aria-label={`${guild.data?.name ?? "Unknown server"}: ${name}`}>
          {name}
        </h1>
        <MenuButton />
      </div>
      <Separator orientation="horizontal" />
      <div className="grow overflow-hidden">
        <div className="h-full overflow-auto">{props.children}</div>
      </div>
    </div>
  );
}
