import type { DataSource } from "@mc/common/DataSource";
import type { Grammar } from "prismjs";
import type { Descendant } from "slate";

import { DATA_SOURCE_DELIMITER } from "@mc/common/DataSource";

import type {
  CustomElement,
  CustomText,
  DataSourceElement,
  EmojiElement,
  Marks,
  MentionElement,
  ParagraphElement,
} from "../custom-types";

const textFormatDelimiters: Record<keyof Omit<CustomText, "text">, string> = {
  bold: "**",
  underline: "__",
  italic: "*",
  strike: "~~",
  spoiler: "||",
};

export const serialize = (
  nodes: Descendant[],
  features: Grammar,
  dataSourceRefs: Map<string, DataSource> = new Map(),
): string => {
  const serializeText = (text: CustomText): string => {
    let scapedText = text.text;

    for (const key in text) {
      if (key in textFormatDelimiters) {
        const char = textFormatDelimiters[key as Marks][0] ?? "";
        scapedText = scapedText.replaceAll(char, `\\${char}`);
      }
    }

    const parts = [scapedText];

    for (const key in text) {
      if (key in textFormatDelimiters) {
        parts.unshift(textFormatDelimiters[key as Marks]);
        parts.push(textFormatDelimiters[key as Marks]);
      }
    }

    return parts.join("");
  };

  const serializeEmoji = (emojiElement: EmojiElement): string => {
    const { emoji } = emojiElement;
    let emojiString = "";

    if (typeof emoji === "object") {
      emojiString = `<${emoji.animated ? "a" : ""}:${emoji.name}:${emoji.id}>`;
    } else {
      emojiString = emoji;
    }

    return serializeText({ ...emojiElement.children[0], text: emojiString });
  };

  const serializeParagraph = (paragraphElement: ParagraphElement): string => {
    return paragraphElement.children.map(serializeNode).join("");
  };

  const serializeDataSource = (
    dataSourceElement: DataSourceElement,
  ): string => {
    const dataSource = dataSourceRefs.get(dataSourceElement.dataSourceRefId);

    if (!dataSource)
      throw new Error("Failed to serialize a non existing data source");

    return serializeText({
      ...dataSourceElement.children[0],
      text: `${DATA_SOURCE_DELIMITER}${JSON.stringify(dataSource)}${DATA_SOURCE_DELIMITER}`,
    });
  };

  const serializeMention = (mentionElement: MentionElement): string => {
    const mentionType = "role" in mentionElement ? "@&" : "#";
    const id =
      "role" in mentionElement ? mentionElement.role : mentionElement.channel;

    return serializeText({
      ...mentionElement.children[0],
      text: `<${mentionType}${id}>`,
    });
  };

  const serializeElement = (element: CustomElement): string => {
    if (element.type === "dataSource" && element.type in features) {
      return serializeDataSource(element);
    } else if (element.type === "emoji" && element.type in features) {
      return serializeEmoji(element);
    } else if (element.type === "paragraph") {
      return serializeParagraph(element);
    } else if (element.type === "mention") {
      return serializeMention(element);
    } else {
      return "";
    }
  };

  const serializeNode = (node: Descendant): string => {
    if ("text" in node) {
      return serializeText(node);
    } else {
      return serializeElement(node);
    }
  };

  return nodes.map(serializeNode).join("\n");
};
