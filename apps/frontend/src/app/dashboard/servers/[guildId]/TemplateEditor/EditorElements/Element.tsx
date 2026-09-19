import type { JSX } from "react";
import type { RenderElementProps } from "slate-react";
import { useContext } from "react";
import { DefaultElement } from "slate-react";

import DataSourceElement from "../DataSource/DataSourceElement";
import EmojiElement from "../Emoji/EmojiElement";
import { MentionElement } from "../Mention/MentionElement";
import { TemplateEditorContext } from "../TemplateEditorContext";

export default function Element(props: RenderElementProps): JSX.Element {
  const { features } = useContext(TemplateEditorContext);
  if ("dataSource" in features && props.element.type === "dataSource") {
    return <DataSourceElement {...props} />;
  } else if ("emoji" in features && props.element.type === "emoji") {
    return <EmojiElement {...props} />;
  } else if (
    ("role" in features || "channel" in features) &&
    props.element.type === "mention"
  ) {
    return <MentionElement {...props} />;
  } else {
    return <DefaultElement {...props} />;
  }
}
