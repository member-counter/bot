"use client";

import type { LucideIcon } from "lucide-react";
import { useContext } from "react";
import { ChannelType } from "discord-api-types/v10";
import { FolderIcon, HelpCircleIcon, MenuIcon } from "lucide-react";

import { Button } from "@mc/ui/button";
import { Separator } from "@mc/ui/separator";

import type { DashboardGuildParams } from "../layout";
import { api } from "~/trpc/react";
import { ChannelIconMap } from "../ChannelIconMap";
import { ServerNavMenuContext } from "../ManageServer";

export type DashboardGuildChannelParams = {
  channelId: string;
} & DashboardGuildParams;

interface Props {
  params: DashboardGuildChannelParams;
}

export default function Page(props: Props) {
  const menuContext = useContext(ServerNavMenuContext);
  const { channelId, guildId } = props.params;
  const guild = api.discord.getGuild.useQuery({ id: guildId });

  if (!guild.data) return;

  const channel = guild.data.channels.get(channelId);

  if (!channel) return; // TODO handle the case where the channel doesn't exist but we still have data about it

  let Icon: LucideIcon | undefined = ChannelIconMap[channel.type];
  if (channel.type === ChannelType.GuildCategory) Icon = FolderIcon;
  Icon ??= HelpCircleIcon;

  return (
    <div className="flex flex-col">
      <div className="flex h-[48px] w-full flex-shrink-0 flex-row items-center pl-3 pr-1 font-semibold">
        <Icon className="mr-3 h-5 w-5" />
        <div>{channel.name}</div>
        <Button
          className="ml-auto sm:hidden"
          size={"icon"}
          variant={"ghost"}
          onClick={() => menuContext.setIsOpen(true)}
        >
          <MenuIcon className="h-5 w-5" />
        </Button>
      </div>
      <Separator orientation="horizontal" />
      <h1>Current selected channel: {props.params.channelId} </h1>
    </div>
  );
}
