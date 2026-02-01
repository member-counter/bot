import type { JSX } from "react";
import type { RenderLeafProps } from "slate-react";
import { useContext } from "react";

import { TemplateEditorContext } from "../TemplateEditorContext";

export default function Leaf({
  leaf,
  children,
  attributes,
}: RenderLeafProps): JSX.Element {
  const { features } = useContext(TemplateEditorContext);
  let className = "";

  if ("bold" in features && leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if ("italic" in features && leaf.italic) {
    children = <em>{children}</em>;
  }

  if ("underline" in features && leaf.underline) {
    children = <u>{children}</u>;
  }

  if ("strike" in features && leaf.strike) {
    children = <s>{children}</s>;
  }

  if (leaf.spoiler) {
    className = "bg-secondary rounded-md m-0 p-0 align-baseline";
  }

  return (
    <span {...attributes} className={className}>
      {children}
    </span>
  );
}
