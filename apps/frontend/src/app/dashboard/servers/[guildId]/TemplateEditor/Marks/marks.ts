import type { Grammar } from "prismjs";
import { Editor } from "slate";

import type { Marks } from "../custom-types";

export const isMarkActive = (editor: Editor, format: Marks): boolean => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

export default function toggleMark(
  editor: Editor,
  format: Marks,
  allowedFormat: Grammar,
) {
  if (!(format in allowedFormat)) return;

  const isActive = isMarkActive(editor, format);
  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
}
