import type { LucideIcon } from "lucide-react";
import { useContext, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChannelType, PermissionFlagsBits } from "discord-api-types/v10";
import { BookTextIcon, HelpCircleIcon, LockKeyholeIcon } from "lucide-react";

import { BitField } from "@mc/common/BitField";
import { cn } from "@mc/ui";
import { Skeleton } from "@mc/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@mc/ui/tooltip";

import type { DashboardGuildParams } from "../layout";
import { InfoToolip } from "~/app/components/InfoTooltip";
import { MenuContext } from "~/app/dashboard/layout";
import { Routes } from "~/other/routes";
import { api } from "~/trpc/react";
import { ChannelIconMap } from "../ChannelMaps";

export function ChannelNavItem(channel: {
  id: string;
  type: ChannelType;
  name: string;
  everyonePermissions: string;
}) {
  const menuContext = useContext(MenuContext);
  const { guildId, channelId } = useParams<DashboardGuildParams>();
  const guild = api.discord.getGuild.useQuery({ id: guildId });

  const isSelected = channelId === channel.id;
  const isSupported = [
    ChannelType.GuildText,
    ChannelType.GuildCategory,
    ChannelType.GuildVoice,
    ChannelType.GuildAnnouncement,
  ].includes(channel.type);
  const isCategory = channel.type === ChannelType.GuildCategory;
  const isRulesChannel = guild.data?.rulesChannelId === channel.id;
  const isShowingLockpad =
    channel.type === ChannelType.GuildVoice &&
    new BitField(channel.everyonePermissions).missing(
      PermissionFlagsBits.Connect,
    );

  let Icon: LucideIcon | undefined;
  if (isRulesChannel) Icon = BookTextIcon;
  if (isShowingLockpad) Icon = LockKeyholeIcon;
  Icon ??= ChannelIconMap[channel.type];
  Icon ??= HelpCircleIcon;

  // TODO underline the channel name if it has a counter
  const hasCounter = false;
  const hasCounterIssue = false;

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={Routes.DashboardServers(
              guildId,
              isSupported ? channel.id : undefined,
            )}
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
            prefetch={true}
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
                  hasCounterIssue
                    ? "A couner in this channel requires your attention"
                    : "Counters are enabled in this channel"
                }
              >
                <div className="ml-auto">
                  <div className="ml-2 inline-block h-2 w-2 flex-shrink-0 rounded-full bg-primary">
                    {hasCounterIssue && (
                      <div className="absolute ml-auto inline-block h-2 w-2 animate-ping rounded-full bg-primary"></div>
                    )}
                  </div>
                </div>
              </InfoToolip>
            )}
          </Link>
        </TooltipTrigger>
        {!isSupported && (
          <TooltipContent>
            This channel type is not supported yet.
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
