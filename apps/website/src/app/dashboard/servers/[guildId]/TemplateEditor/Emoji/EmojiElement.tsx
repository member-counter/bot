import type { RenderElementProps } from "slate-react";

import type { EmojiElement as EmojiElementType } from "../custom-types";
import { GuildEmojiRenderer } from "~/app/components/GuildEmojiRenderer";
import { TwemojiRenderer } from "~/app/components/TwemojiRenderer";

export default function EmojiElement(props: RenderElementProps): JSX.Element {
  const element = props.element as EmojiElementType;
  const className = "inline-block h-[20px] mb-[3px]";
  return (
    <span {...props.attributes} contentEditable={false}>
      {typeof element.emoji === "string" ? (
        <TwemojiRenderer className={className} emoji={element.emoji} />
      ) : (
        <GuildEmojiRenderer className={className} emoji={element.emoji} />
      )}
      {props.children}
    </span>
  );
}
