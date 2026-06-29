import type { LucideIcon } from "lucide-react";
import { useMemo } from "react";
import { ChannelType } from "discord-api-types/v10";
import { BookTextIcon, HelpCircleIcon, LockKeyholeIcon } from "lucide-react";

import { isTextLikeChannel } from "@mc/common/channelType";
import { cn } from "@mc/ui";
import { Skeleton } from "@mc/ui/skeleton";

import { ChannelIconMap } from "~/app/dashboard/servers/[guildId]/ChannelMaps";
import { selectedChannelInChannelListColor } from "./colors";

export function ChannelNavItem({
  type,
  name,
  isSelected,
  isRulesChannel,
  onClick,
  highlighted,
}: {
  type: ChannelType;
  name: string;
  isSelected: boolean;
  isRulesChannel: boolean;
  onClick?: () => void;
  highlighted?: boolean;
}) {
  let Icon: LucideIcon | undefined = ChannelIconMap[type];
  if (type === ChannelType.GuildVoice) Icon = LockKeyholeIcon;
  if (type === ChannelType.GuildText && isRulesChannel) Icon = BookTextIcon;
  Icon ??= HelpCircleIcon;

  const isCategory = type === ChannelType.GuildCategory;
  const isTextBased = isTextLikeChannel(type);
  return (
    <div
      className={cn(
        "group block select-none",
        "flex flex-row items-center transition-[background-color,color] duration-300",
        {
          "mb-1 mt-4 pr-2 text-xs text-muted-foreground": isCategory,
          "rounded-sm px-2 py-1.5 text-sm": !isCategory,
          "text-foreground": isSelected || highlighted,
          [`cursor-pointer hover:bg-[#3f4248]`]: isTextBased,
          "relative text-white": highlighted,
        },
      )}
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
            "text-white": highlighted,
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
