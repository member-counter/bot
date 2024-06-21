import type { ReactNode } from "react";
import React, { memo, useContext } from "react";
import { useSlate } from "slate-react";

import { Toggle } from "@mc/ui/toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@mc/ui/tooltip";

import type { Marks } from "../custom-types";
import { TemplateEditorContext } from "../TemplateEditorContext";
import toggleMark, { isMarkActive } from "./marks";

export const MarkButton = memo(function MarkButton({
  className,
  format,
  noPopoverLabel = false,
  children,
  disabled,
}: {
  className?: string;
  format: Marks;
  noPopoverLabel?: boolean;
  children: ReactNode;
  disabled?: boolean;
}) {
  const { features } = useContext(TemplateEditorContext);
  const editor = useSlate();

  const toggleButton = (
    <Toggle
      aria-label={`Toggle ${format}`}
      pressed={isMarkActive(editor, format)}
      onPressedChange={() => toggleMark(editor, format, features)}
      className={className}
      disabled={disabled}
    >
      {children}
    </Toggle>
  );

  if (noPopoverLabel) return toggleButton;
  else
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>{toggleButton}</TooltipTrigger>
          <TooltipContent>
            {format.charAt(0).toUpperCase() + format.slice(1)}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
});
