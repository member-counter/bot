import type { ElementType, JSX } from "react";

import { SelectItem } from "./select";

export function SelectItemWithIcon({
  label,
  icon: Icon,
  value,
  rightElement,
  disabled,
}: {
  label: string;
  value: string;
  icon?: ElementType;
  rightElement?: JSX.Element;
  disabled?: boolean;
}): JSX.Element {
  return (
    <SelectItem value={value} disabled={disabled} className="flex flex-row">
      {Icon && <Icon className="mr-2 mt-[-2px] inline h-4 w-4" />}
      <span className="mr-auto inline">{label}</span>
      {rightElement && rightElement}
    </SelectItem>
  );
}
