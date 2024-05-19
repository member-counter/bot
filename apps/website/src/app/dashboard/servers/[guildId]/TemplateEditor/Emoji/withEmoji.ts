import type { Editor } from "slate";

export default function withEmoji<E extends Editor>(editor: E): E {
  const { isVoid, isInline, isElementReadOnly } = editor;

  editor.isInline = (element) => {
    return element.type === "emoji" || isInline(element);
  };

  editor.isVoid = (element) => {
    return element.type === "emoji" || isVoid(element);
  };

  editor.isElementReadOnly = (element) => {
    return element.type === "emoji" || isElementReadOnly(element);
  };

  return editor;
}
