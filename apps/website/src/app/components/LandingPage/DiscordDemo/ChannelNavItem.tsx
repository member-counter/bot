import type { LucideIcon } from "lucide-react";
import { useMemo } from "react";
import { ChannelType } from "discord-api-types/v10";
import { HelpCircleIcon, LockKeyholeIcon } from "lucide-react";

import { cn } from "@mc/ui";
import { Skeleton } from "@mc/ui/skeleton";

import { ChannelIconMap } from "~/app/dashboard/servers/[guildId]/ChannelMaps";
import { selectedChannelInChannelListColor } from "./colors";

export function ChannelNavItem({
  type,
  name,
  isSelected,
  onClick,
}: {
  type: ChannelType;
  name: string;
  isSelected: boolean;
  onClick?: () => void;
}) {
  let Icon: LucideIcon | undefined = ChannelIconMap[type];
  if (type === ChannelType.GuildVoice) Icon = LockKeyholeIcon;
  Icon ??= HelpCircleIcon;

  const isCategory = type === ChannelType.GuildCategory;
  const isTextBased =
    type === ChannelType.GuildText || type === ChannelType.GuildAnnouncement;
  return (
    <div
      className={cn("group block select-none", "flex flex-row items-center", {
        "mb-1 mt-4 pr-2 text-xs text-muted-foreground": isCategory,
        "rounded-sm px-2 py-1.5 text-sm": !isCategory,
        "text-foreground": isSelected,
        [`cursor-pointer hover:bg-[#3f4248]`]: isTextBased,
      })}
      style={{
        backgroundColor: isSelected ? selectedChannelInChannelListColor : "",
      }}
      onClick={() => isTextBased && onClick?.()}
    >
      <span
        className={cn(
          isCategory && "uppercase",
          "flex-shrink overflow-hidden text-ellipsis whitespace-nowrap",
        )}
      >
        <Icon
          className={cn("mr-2 mt-[-2px] inline h-5 w-5 text-muted-foreground", {
            "mr-1 h-4 w-4": isCategory,
          })}
          aria-hidden
        />
        {name}
      </span>
    </div>
  );
}

export const ChannelNavItemSkeleton = () => {
  const random = useMemo(() => Math.floor(Math.random() * 100), []);
  return (
    <div className="flex h-[32px] w-full flex-shrink-0 items-center">
      <Skeleton
        className="ml-2 h-[20px] animate-none rounded-full"
        style={{
          width: 100 + random + "px",
          backgroundColor: selectedChannelInChannelListColor,
        }}
      />
    </div>
  );
};
