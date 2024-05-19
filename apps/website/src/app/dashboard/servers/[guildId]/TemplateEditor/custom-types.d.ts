import type { BaseEditor, Descendant } from "slate";
import type { ReactEditor } from "slate-react";

import type { DataSourceRefId } from "./utils";

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

export type CustomElement =
  | ParagraphElement
  | DataSourceElement
  | EmojiElement
  | MentionElement;

export interface ParagraphElement {
  type: "paragraph";
  children: Descendant[];
}

export interface EmojiElement {
  type: "emoji";
  children: [CustomText];
  emoji: string | { id: string; name: string; animated: booelan };
}

export interface DataSourceElement {
  type: "dataSource";
  children: [CustomText];
  dataSourceRefId: DataSourceRefId;
}

export type MentionElement = {
  type: "mention";
  children: [CustomText];
} & (RoleMentionElement | ChannelMentionElement);

export interface RoleMentionElement {
  role: string;
}

export interface ChannelMentionElement {
  channel: string;
}

export type Marks = "bold" | "italic" | "underline" | "strike" | "spoiler";

export type CustomText = {
  text: string;
} & {
  [key in Marks]?: boolean;
};
