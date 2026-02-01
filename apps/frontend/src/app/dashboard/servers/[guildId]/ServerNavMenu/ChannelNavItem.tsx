import { useContext, useMemo } from "react";
import { ChannelType } from "discord-api-types/v10";
import { useTranslation } from "react-i18next";
import { useTypedParams } from "react-router-typesafe-routes";
import invariant from "tiny-invariant";

import { routes } from "@mc/common/Routes";
import { cn } from "@mc/ui";
import { Skeleton } from "@mc/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@mc/ui/tooltip";

import { InfoToolip } from "~/app/components/InfoTooltip";
import { MenuContext } from "~/app/dashboard/Menu";
import { Link } from "~/lib/navigation";
import { api } from "~/lib/trpc";
import { useChannelIcon } from "../ChannelMaps";

export function ChannelNavItem(channel: {
  id: string;
  type: ChannelType;
  name: string;
  everyonePermissions: string;
}) {
  const { t } = useTranslation();
  const menuContext = useContext(MenuContext);
  invariant(menuContext, "Expected menuContext to be defined");
  const { guildId, channelId } = useTypedParams(
    routes.dashboard.servers.server.channel,
  );
  invariant(guildId, "Expected guildId to be defined");
  const guildSettingsChannels = api.guild.channels.getAll.useQuery({
    discordGuildId: guildId,
  });
  const channelsLogs = api.guild.channels.logs.getAll.useQuery({
    discordGuildId: guildId,
  });

  const isSelected = channelId === channel.id;
  const isSupported = [
    ChannelType.GuildText,
    ChannelType.GuildCategory,
    ChannelType.GuildVoice,
    ChannelType.GuildAnnouncement,
  ].includes(channel.type);
  const isCategory = channel.type === ChannelType.GuildCategory;

  const Icon = useChannelIcon(channel.id, true);

  const hasCounter = guildSettingsChannels.data?.channels.get(
    channel.id,
  )?.isTemplateEnabled;

  const hasIssue = !!channelsLogs.data?.channelLogs.get(channel.id)
    ?.LastTemplateComputeError;

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            to={routes.dashboard.servers.server.channel.$buildPath({
              params: { guildId, channelId: isSupported ? channel.id : "" },
            })}
            onClick={() => menuContext.setIsOpen(false)}
            className={cn(
              "group block cursor-pointer",
              "flex flex-row items-center",
              {
                "mb-1 mt-4 pr-2 text-xs text-muted-foreground hover:text-foreground":
                  isCategory,
                "rounded-sm px-2 py-1.5 text-sm": !isCategory,
                "hover:text-muted-accent-foreground cursor-not-allowed text-muted-foreground":
                  !isSupported,
                "text-foreground": isCategory && isSelected,
                "bg-accent text-foreground": !isCategory && isSelected,
                "hover:bg-accent": isSupported && !isCategory,
              },
            )}
          >
            <span
              className={cn(
                isCategory && "uppercase",
                "flex-shrink overflow-hidden text-ellipsis whitespace-nowrap",
              )}
            >
              <Icon
                className={cn(
                  "mr-2 mt-[-2px] inline h-5 w-5 text-muted-foreground",
                  {
                    "mr-1 h-4 w-4": isCategory,
                  },
                )}
                aria-hidden
              />
              {channel.name}
            </span>
            {hasCounter && (
              <InfoToolip
                text={
                  hasIssue
                    ? t(
                        "pages.dashboard.servers.ChannelNavItem.infoTooltip.issue",
                      )
                    : t(
                        "pages.dashboard.servers.ChannelNavItem.infoTooltip.enabled",
                      )
                }
              >
                <div className="ml-auto">
                  <div
                    className={cn(
                      "relative ml-2 h-2 w-2 flex-shrink-0 rounded-full bg-primary",
                      { "bg-destructive": hasIssue },
                    )}
                    tabIndex={0}
                  >
                    <div
                      className={cn(
                        "bg-primarye absolute h-full w-full rounded-full",
                        { "animate-ping bg-destructive": hasIssue },
                      )}
                    ></div>
                  </div>
                </div>
              </InfoToolip>
            )}
          </Link>
        </TooltipTrigger>
        {!isSupported && (
          <TooltipContent>
            {t("pages.dashboard.servers.ChannelNavItem.unsupportedChannelType")}
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}

export const ChannelNavItemSkeleton = () => {
  const random = useMemo(() => Math.floor(Math.random() * 100), []);
  return (
    <div className="flex h-[32px] w-full flex-shrink-0 items-center">
      <Skeleton
        className="ml-2 h-[20px] rounded-full"
        style={{
          width: 100 + random + "px",
          animationDelay: random * random + "ms",
        }}
      />
    </div>
  );
};
