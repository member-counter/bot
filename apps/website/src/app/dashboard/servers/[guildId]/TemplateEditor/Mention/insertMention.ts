import type { Editor } from "slate";
import { Transforms } from "slate";

import type { MentionElement } from "../custom-types";
import type { GuildChannel, GuildRole } from "../d-types";

export const insertMention = (
  editor: Editor,
  mentionable: GuildRole | GuildChannel,
) => {
  let mention: MentionElement | null = null;

  if ("color" in mentionable) {
    mention = {
      type: "mention",
      role: mentionable.id,
      children: [{ text: "" }],
    };
  } else {
    mention = {
      type: "mention",
      channel: mentionable.id,
      children: [{ text: "" }],
    };
  }

  Transforms.insertNodes(editor, mention);
  Transforms.move(editor);
};
