import twemoji from "@twemoji/api";

export const TwemojiRenderer = ({
  emoji,
  className = "",
}: {
  className?: string;
  emoji: string;
}) => {
  const url = "".concat(
    twemoji.base,
    "svg/",
    twemoji.convert.toCodePoint(emoji),
    ".svg",
  );

  // eslint-disable-next-line @next/next/no-img-element
  return <img className={className} alt={emoji} src={url} draggable="false" />;
};
