import { memo, useContext, useMemo } from "react";
import { SettingsIcon, XIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useMatch } from "react-router";
import { useTypedParams } from "react-router-typesafe-routes";

import { routes } from "@mc/common/Routes";
import { cn } from "@mc/ui";
import { Button } from "@mc/ui/button";
import { Separator } from "@mc/ui/separator";
import { Skeleton } from "@mc/ui/skeleton";

import { MenuContext } from "~/app/dashboard/Menu";
import { api } from "~/lib/trpc";
import { ChannelNavItem, ChannelNavItemSkeleton } from "./ChannelNavItem";
import { sortChannels } from "./sortChannels";
import invariant from "tiny-invariant";

export const ServerNavMenu = memo(function ServerNavMenu({
  className,
}: {
  className?: string;
}) {
  const { t } = useTranslation();
  const menuContext = useContext(MenuContext);
  const { guildId } = useTypedParams(routes.dashboard.servers.server);
  invariant(guildId, "Expected guildId to be defined");
  invariant(menuContext, "Expected menuContext to be defined");
  const isInSettings = !!useMatch(
    routes.dashboard.servers.server.settings.$buildPath({
      params: { guildId },
    }),
  );
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
          className="flex-shrink overflow-hidden text-ellipsis whitespace-nowrap pl-4"
          aria-hidden
        >
          {!guild.data && (
            <Skeleton className="h-[20px] w-[120px] rounded-full" />
          )}
          {guild.data?.name}
        </div>
        <Link
          to={routes.dashboard.servers.server.settings.$buildPath({
            params: { guildId },
          })}
          onClick={() => menuContext.setIsOpen(false)}
          className="ml-auto mr-1"
          aria-hidden
          tabIndex={-1}
        >
          <Button
            aria-label={t(
              "pages.dashboard.servers.ServerNavMenu.serverSettings",
            )}
            size={"icon"}
            variant={"ghost"}
            className={cn({ hidden: isInSettings })}
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
