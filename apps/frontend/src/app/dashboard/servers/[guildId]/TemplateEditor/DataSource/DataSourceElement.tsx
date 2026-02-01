import type { JSX } from "react";
import type { RenderElementProps } from "slate-react";
import { useContext, useMemo } from "react";
import { Eye } from "lucide-react";
import { useFocused, useSelected } from "slate-react";

import { DataSourceId } from "@mc/common/DataSource";

import type { DataSourceElement as DataSourceElementType } from "../custom-types";
import { InlineChromiumBugfix } from "../EditorElements/ChromiumBugFix";
import { TemplateEditorContext } from "../TemplateEditorContext";
import { useDataSourceRefs } from "./DataSourceRefs";
import { useDataSourceMetadata } from "./metadata";

export default function DataSourceElement(
  props: RenderElementProps,
): JSX.Element {
  const element = props.element as DataSourceElementType;
  const selected = useSelected();
  const focused = useFocused();
  const { disabled } = useContext(TemplateEditorContext);
  const { setEditingDataSourceRefId, editingDataSourceRefId, dataSourceRefs } =
    useDataSourceRefs();

  const dataSource = useMemo(
    () =>
      dataSourceRefs.get(element.dataSourceRefId) ?? {
        id: DataSourceId.UNKNOWN,
      },
    [dataSourceRefs, element.dataSourceRefId],
  );

  const metadata = useDataSourceMetadata(dataSource.id);

  const displayName = useMemo(
    () => metadata.displayName(dataSource),
    [dataSource, metadata],
  );

  const style: React.CSSProperties = {
    boxShadow:
      (selected && focused) ||
      editingDataSourceRefId === element.dataSourceRefId
        ? "0 0 0px 1px #fff"
        : "none",
    userSelect: "none",
    fontSize: "0.9rem",
  };

  if (element.children[0].bold) {
    style.fontWeight = "bold";
  }
  if (element.children[0].italic) {
    style.fontStyle = "italic";
  }
  if (element.children[0].underline) {
    style.textDecoration = "underline";
  }
  if (element.children[0].strike) {
    style.textDecoration = "line-through";
  }

  const iconClass = "h-3.5 w-3.5 inline mr-1 relative top-[-1px]";
  const icon = element.children[0].spoiler ? (
    <Eye className={iconClass} />
  ) : (
    <metadata.icon className={iconClass} />
  );

  return (
    <span
      {...props.attributes}
      contentEditable={false}
      className="m-0 rounded-md bg-primary px-[4px] py-[2px] align-baseline"
      style={style}
      role="button"
      tabIndex={0}
      onKeyDown={(e) =>
        ["Enter", " "].includes(e.key) &&
        !disabled &&
        setEditingDataSourceRefId(element.dataSourceRefId)
      }
      onClick={() =>
        !disabled && setEditingDataSourceRefId(element.dataSourceRefId)
      }
    >
      <InlineChromiumBugfix />
      {icon}
      {displayName}
      {props.children}
      <InlineChromiumBugfix />
    </span>
  );
}
