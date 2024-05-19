import type { Grammar } from "prismjs";
import type { Editor } from "slate";
import isHotkey from "is-hotkey";

import type { Marks } from "../custom-types";
import toggleMark from "./marks";

const MARK_HOTKEYS: Record<string, Marks> = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+s": "strike",
  "mod+h": "spoiler",
};

export default function hotkeyHandler(
  event: React.KeyboardEvent<HTMLDivElement>,
  editor: Editor,
  features: Grammar,
) {
  for (const hotkey in MARK_HOTKEYS) {
    const mark = MARK_HOTKEYS[hotkey];
    if (!mark) continue;

    if (isHotkey(hotkey, event) && mark in features) {
      event.preventDefault();
      toggleMark(editor, mark, features);
    }
  }
}
