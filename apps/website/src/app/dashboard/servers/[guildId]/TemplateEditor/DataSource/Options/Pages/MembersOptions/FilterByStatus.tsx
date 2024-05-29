import {
  AsteriskIcon,
  CircleDashedIcon,
  CircleIcon,
  MinusCircleIcon,
  MoonIcon,
} from "lucide-react";

import { MembersFilterStatus } from "@mc/common/DataSource";
import { Label } from "@mc/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from "@mc/ui/select";
import { SelectItemWithIcon } from "@mc/ui/selectItemWithIcon";

type Type = number;
export function FilterByStatus({
  value,
  onChange,
}: {
  value: Type;
  onChange: (value: Type) => void;
}) {
  return (
    <div>
      <Label>Filter by status</Label>
      <Select
        value={value.toString()}
        onValueChange={(value) => onChange(Number(value))}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a status" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItemWithIcon
              value={MembersFilterStatus.ANY.toString()}
              label={"Any"}
              icon={AsteriskIcon}
            />
            <SelectItemWithIcon
              value={MembersFilterStatus.ONLINE.toString()}
              label={"Online"}
              icon={CircleIcon}
            />
            <SelectItemWithIcon
              value={MembersFilterStatus.IDLE.toString()}
              label={"Idle"}
              icon={MoonIcon}
            />
            <SelectItemWithIcon
              value={MembersFilterStatus.DND.toString()}
              label={"Do not disturb"}
              icon={MinusCircleIcon}
            />

            <SelectItemWithIcon
              value={MembersFilterStatus.OFFLINE.toString()}
              label={"Offline"}
              icon={CircleDashedIcon}
            />
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
