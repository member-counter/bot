import { useContext, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { SettingsIcon, XIcon } from "lucide-react";

import { cn } from "@mc/ui";
import { Button } from "@mc/ui/button";
import { Separator } from "@mc/ui/separator";

import type { DashboardGuildChannelParams } from "../[channelId]/page";
import { Routes } from "~/other/routes";
import { api } from "~/trpc/react";
import { ServerNavMenuContext } from ".";
import { ChannelNavItem } from "./ChannelNavItem";
import { sortChannels } from "./sortChannels";

export function ServerNavMenu({ className }: { className?: string }) {
  const menuContext = useContext(ServerNavMenuContext);
  const { guildId } = useParams<DashboardGuildChannelParams>();
  const guild = api.discord.getGuild.useQuery({ id: guildId });
  const channels = useMemo(
    () => sortChannels([...(guild.data?.channels.values() ?? [])]),
    [guild.data?.channels],
  );

  // TODO display saved channels if the discord channels are unable to load

  return (
    <div
      className={cn(
        "flex max-h-full flex-col overflow-hidden bg-card",
        className,
      )}
    >
      <div className="flex h-[48px] min-h-[48px] min-w-0 items-center font-semibold">
        <p className="flex-shrink overflow-hidden  text-ellipsis whitespace-nowrap pl-4">
          {guild.data?.name}
        </p>
        <Link
          href={Routes.DashboardServers(guildId, "settings")}
          className="ml-auto mr-1"
        >
          <Button size={"icon"} variant={"ghost"}>
            <SettingsIcon className="h-5 w-5" />
          </Button>
        </Link>
        <Button
          className="mr-1 flex-shrink-0 sm:hidden"
          size={"icon"}
          variant={"ghost"}
          onClick={() => menuContext.setIsOpen(false)}
        >
          <XIcon className="h-5 w-5" />
        </Button>
      </div>

      <Separator />
      <div className="flex max-h-full grow flex-col gap-1 overflow-auto p-[8px]">
        {channels.map((channel) => (
          <ChannelNavItem {...channel} key={channel.id} />
        ))}
      </div>
    </div>
  );
}
