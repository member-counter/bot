import type { ReactNode } from "react";
import React, { useContext } from "react";
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

export const MarkButton = ({
  className,
  format,
  noPopoverLabel = false,
  children,
}: {
  className?: string;
  format: Marks;
  noPopoverLabel?: boolean;
  children: ReactNode;
}) => {
  const { features } = useContext(TemplateEditorContext);
  const editor = useSlate();

  const toggleButton = (
    <Toggle
      aria-label={`Toggle ${format}`}
      pressed={isMarkActive(editor, format)}
      onPressedChange={() => toggleMark(editor, format, features)}
      className={className}
    >
      {children}
    </Toggle>
  );

  if (noPopoverLabel) return toggleButton;
  else
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>{toggleButton}</div>
          </TooltipTrigger>
          <TooltipContent>
            {format.charAt(0).toUpperCase() + format.slice(1)}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
};
