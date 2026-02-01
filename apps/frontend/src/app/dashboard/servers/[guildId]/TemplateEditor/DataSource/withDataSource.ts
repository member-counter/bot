import type { Editor } from "slate";

export default function withDataSource<E extends Editor>(editor: E): E {
  const { isVoid, isInline, markableVoid } = editor;

  editor.isVoid = (element) => element.type === "dataSource" || isVoid(element);

  editor.isInline = (element) =>
    element.type === "dataSource" || isInline(element);

  editor.markableVoid = (element) =>
    element.type === "dataSource" || markableVoid(element);

  return editor;
}
