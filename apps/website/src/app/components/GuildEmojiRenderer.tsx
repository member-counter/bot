import {
  CDNRoutes,
  ImageFormat,
  RouteBases,
  Routes,
} from "discord-api-types/v10";

import type { GuildEmoji } from "../dashboard/servers/[guildId]/TemplateEditor/d-types";

export const GuildEmojiRenderer = ({
  emoji,
  className = "",
}: {
  className?: string;
  emoji: GuildEmoji;
}) => {
  Routes;
  const url = `${RouteBases.cdn}${CDNRoutes.emoji(emoji.id, emoji.animated ? ImageFormat.GIF : ImageFormat.JPEG)}?size=48`;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img className={className} alt={emoji.name} src={url} draggable="false" />
  );
};
