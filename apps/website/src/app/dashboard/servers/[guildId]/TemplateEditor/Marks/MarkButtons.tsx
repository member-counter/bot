import React, { useContext } from "react";
import {
  BoldIcon,
  EyeIcon,
  ItalicIcon,
  StrikethroughIcon,
  UnderlineIcon,
} from "lucide-react";

import type { Marks } from "../custom-types";
import { TemplateEditorContext } from "../TemplateEditorContext";
import { MarkButton } from "./MarkButton";

export const FORMAT_ICONS = {
  bold: BoldIcon,
  italic: ItalicIcon,
  underline: UnderlineIcon,
  strike: StrikethroughIcon,
  spoiler: EyeIcon,
};

export const MarkButtons = ({
  iconClassName = "h-4 w-4",
  buttonClassName,
  noPopoverLabel,
  disabled,
}: {
  iconClassName?: string;
  buttonClassName?: string;
  noPopoverLabel?: boolean;
  disabled?: boolean;
}) => {
  const { features } = useContext(TemplateEditorContext);
  return (
    <>
      {Object.entries(FORMAT_ICONS)
        .filter(([formatKey]) => formatKey in features)
        .map(([formatKey, Icon]) => (
          <MarkButton
            format={formatKey as Marks}
            key={formatKey}
            className={buttonClassName}
            noPopoverLabel={noPopoverLabel}
            disabled={disabled}
          >
            <Icon className={iconClassName} />
          </MarkButton>
        ))}
    </>
  );
};
