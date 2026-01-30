import twemoji from "@twemoji/api";
import { grabTheRightIcon } from "../dashboard/servers/[guildId]/TemplateEditor/Emoji/twemojiMap";

export const TwemojiRenderer = ({
  emoji,
  className = "",
}: {
  className?: string;
  emoji: string;
}) => {
  const codePoint = grabTheRightIcon(emoji);

  const url = "".concat(
    twemoji.base,
    "svg/",
    codePoint,
    ".svg",
  );

  return <img className={className} alt={emoji} src={url} draggable="false" />;
};
