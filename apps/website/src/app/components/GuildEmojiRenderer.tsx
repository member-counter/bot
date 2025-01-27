import { CDNRoutes, ImageFormat, RouteBases } from "discord-api-types/v10";

import { cn } from "@mc/ui";

import type { GuildEmoji } from "../dashboard/servers/[guildId]/TemplateEditor/d-types";

export const GuildEmojiRenderer = ({
  emoji,
  className,
}: {
  className?: string;
  emoji: GuildEmoji;
}) => {
  const url = `${RouteBases.cdn}${CDNRoutes.emoji(emoji.id, emoji.animated ? ImageFormat.GIF : ImageFormat.PNG)}?size=48`;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={cn("w-[32px]", className)}
      alt={emoji.name}
      src={url}
      draggable="false"
    />
  );
};
