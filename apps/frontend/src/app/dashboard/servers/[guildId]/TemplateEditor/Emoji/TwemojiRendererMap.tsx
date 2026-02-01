import { emojisKeys } from "./emojis";
import { IMAGE_RESOLUTION, indexToCoords } from "./twemojiMap";
import { getTwemojiMapBySkinTone } from "./twemojiMaps";

export const TwemojiRendererMap = ({
  emoji,
  skinTone,
  className = "",
}: {
  className?: string;
  emoji: string;
  skinTone: string;
}) => {
  const selectedSkinMap = getTwemojiMapBySkinTone(skinTone);
  const defaultSkinMap = getTwemojiMapBySkinTone("");
  const emojiIndex = emojisKeys.indexOf(emoji);
  const [emojiX, emojiY] = indexToCoords(
    emojiIndex,
    IMAGE_RESOLUTION,
    selectedSkinMap.width,
  );

  return (
    <div
      className={className}
      aria-label={emoji}
      style={{
        height: IMAGE_RESOLUTION,
        width: IMAGE_RESOLUTION,
        backgroundPosition: `-${emojiX}px -${emojiY}px`,
        backgroundSize: `${selectedSkinMap.width}px ${selectedSkinMap.height}px`,
        backgroundImage: `url('${selectedSkinMap.src}'), url('${defaultSkinMap.src}')`,
      }}
    />
  );
};
