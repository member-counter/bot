import type { RenderElementProps, RenderLeafProps } from "slate-react";
import type { EditableProps } from "slate-react/dist/components/editable";
import { useCallback, useContext, useMemo } from "react";
import { Editable, useSlateStatic } from "slate-react";

import { cn } from "@mc/ui";

import Element from "./EditorElements/Element";
import Leaf from "./EditorElements/Leaf";
import marksHotkeyHandler from "./Marks/hotkeyHandler";
import { TemplateEditorContext } from "./TemplateEditorContext";

export default function TemplateEditorInput(props: EditableProps) {
  const editor = useSlateStatic();
  const { features } = useContext(TemplateEditorContext);

  const renderElement = useCallback(
    (props: RenderElementProps) => <Element {...props} />,
    [],
  );
  const renderLeaf = useCallback(
    (props: RenderLeafProps) => <Leaf {...props} />,
    [],
  );

  const hotkeyHandlerCB = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      marksHotkeyHandler(event, editor, features);
      props.onKeyDown?.(event);
    },
    [editor, features, props],
  );

  const className = useMemo(
    () => cn("focus-within:outline-none", props.className),
    [props.className],
  );

  return (
    <Editable
      {...props}
      className={cn("text-[16px] leading-[25px]", className)}
      renderElement={renderElement}
      renderLeaf={renderLeaf}
      onKeyDown={hotkeyHandlerCB}
    />
  );
}
