import type { Editor } from "slate";

export default function withMention<E extends Editor>(editor: E): E {
  const { isInline, isVoid, markableVoid, isElementReadOnly } = editor;

  editor.isInline = (element) => {
    return element.type === "mention" ? true : isInline(element);
  };

  editor.isVoid = (element) => {
    return element.type === "mention" ? true : isVoid(element);
  };

  editor.markableVoid = (element) => {
    return element.type === "mention" || markableVoid(element);
  };

  editor.isElementReadOnly = (element) => {
    return element.type === "mention" || isElementReadOnly(element);
  };

  return editor;
}
