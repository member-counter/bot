import { useContext, useEffect, useRef } from "react";
import { Editor, Range } from "slate";
import { useFocused, useSlate } from "slate-react";

import { cn } from "@mc/ui";
import { Portal } from "@mc/ui/portal";

import { TemplateEditorContext } from "../TemplateEditorContext";
import { FORMAT_ICONS, MarkButtons } from "./MarkButtons";

export const HoveringToolbar = () => {
  const { features } = useContext(TemplateEditorContext);
  const ref = useRef<HTMLDivElement | null>(null);
  const editor = useSlate();
  const inFocus = useFocused();

  useEffect(() => {
    const el = ref.current;
    const { selection } = editor;
    const domSelection = window.getSelection();

    if (!el) return;

    if (
      !selection ||
      !inFocus ||
      Range.isCollapsed(selection) ||
      Editor.string(editor, selection) === ""
    ) {
      el.removeAttribute("style");
      return;
    }

    if (!domSelection) return;

    const domRange = domSelection.getRangeAt(0);
    const rect = domRange.getBoundingClientRect();
    el.style.opacity = "1";
    el.style.top = `${rect.top + window.pageYOffset - el.offsetHeight}px`;
    el.style.left = `${
      rect.left + window.pageXOffset - el.offsetWidth / 2 + rect.width / 2
    }px`;
  });

  const formatOptions = Object.entries(FORMAT_ICONS).filter(
    ([formatKey]) => formatKey in features,
  );

  if (!formatOptions.length) return null;

  return (
    <Portal>
      <div
        ref={ref}
        className={cn(
          "absolute left-[-10000px] top-[-10000px] z-50 mt-[-6px] flex flex-row rounded-md border bg-background opacity-0 transition-opacity",
        )}
        onMouseDown={(e) => {
          // prevent toolbar from taking focus away from editor
          e.preventDefault();
        }}
      >
        <MarkButtons
          noPopoverLabel
          buttonClassName={cn(["h-8 w-8 rounded-none px-0"])}
          iconClassName="h-4 w-4"
        />
      </div>
    </Portal>
  );
};
