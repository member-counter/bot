import { memo, useContext, useMemo } from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { SettingsIcon, XIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { cn } from "@mc/ui";
import { Button } from "@mc/ui/button";
import { Separator } from "@mc/ui/separator";
import { Skeleton } from "@mc/ui/skeleton";

import type { DashboardGuildChannelParams } from "../[channelId]/layout";
import { MenuContext } from "~/app/dashboard/Menu";
import { Routes } from "~/other/routes";
import { api } from "~/trpc/react";
import { ChannelNavItem, ChannelNavItemSkeleton } from "./ChannelNavItem";
import { sortChannels } from "./sortChannels";

export const ServerNavMenu = memo(function ServerNavMenu({
  className,
}: {
  className?: string;
}) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const menuContext = useContext(MenuContext);
  const { guildId } = useParams<DashboardGuildChannelParams>();
  const guild = api.discord.getGuild.useQuery({ id: guildId });
  const channels = useMemo(
    () => sortChannels([...(guild.data?.channels.values() ?? [])]),
    [guild.data?.channels],
  );

  // TODO show a Uknown channels link to visit saved channels if the discord channels are unable to load

  return (
    <nav
      className={cn(
        "flex max-h-full flex-col overflow-hidden bg-card",
        className,
      )}
      aria-label={`${guild.data?.name ?? ""} ${t("pages.dashboard.servers.ServerNavMenu.channelList")}`}
    >
      <div className="flex h-[48px] min-h-[48px] min-w-0 items-center font-semibold">
        <div
          className="flex-shrink overflow-hidden  text-ellipsis whitespace-nowrap pl-4"
          aria-hidden
        >
          {!guild.data && (
            <Skeleton className="h-[20px] w-[120px] rounded-full" />
          )}
          {guild.data?.name}
        </div>
        <Link
          href={Routes.DashboardServers(guildId, "settings")}
          onClick={() => menuContext.setIsOpen(false)}
          className="ml-auto mr-1"
          aria-hidden
          tabIndex={-1}
          prefetch={true}
        >
          <Button
            aria-label={t(
              "pages.dashboard.servers.ServerNavMenu.serverSettings",
            )}
            size={"icon"}
            variant={"ghost"}
            className={cn({ hidden: pathname.endsWith("settings") })}
          >
            <SettingsIcon className="h-5 w-5" aria-hidden />
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

      <Separator tabIndex={-1} />
      <div className="flex max-h-full grow flex-col gap-1 overflow-auto p-[8px]">
        {channels.map((channel) => (
          <ChannelNavItem {...channel} key={channel.id} />
        ))}
        {!guild.data &&
          new Array(15)
            .fill(null)
            .map((_, i) => <ChannelNavItemSkeleton key={i} />)}
      </div>
    </nav>
  );
});
