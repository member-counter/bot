import { AsteriskIcon, BlendIcon } from "lucide-react";

import { FilterMode } from "@mc/common/DataSource";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@mc/ui/select";
import { SelectItemWithIcon } from "@mc/ui/selectItemWithIcon";

type Type = number;
export function FilterByRoleFilterMode({
  value,
  onChange,
}: {
  value: Type;
  onChange: (value: Type) => void;
}) {
  return (
    <Select
      value={value.toString()}
      onValueChange={(value) => onChange(Number(value))}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select the filter mode" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Filter mode</SelectLabel>
          <SelectItemWithIcon
            value={FilterMode.OR.toString()}
            label={"Any match"}
            icon={AsteriskIcon}
          />
          <SelectItemWithIcon
            value={FilterMode.AND.toString()}
            label={"Overlap"}
            icon={BlendIcon}
          />
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
