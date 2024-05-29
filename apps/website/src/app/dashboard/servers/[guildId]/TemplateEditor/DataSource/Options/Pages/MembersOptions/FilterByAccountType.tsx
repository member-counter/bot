import { AsteriskIcon, UserIcon } from "lucide-react";

import { MembersFilterAccountType } from "@mc/common/DataSource";
import { Label } from "@mc/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from "@mc/ui/select";
import { SelectItemWithIcon } from "@mc/ui/selectItemWithIcon";

import { BotIcon } from "~/app/components/BotIcon";

type Type = number;
export function FilterByAccountType({
  value,
  onChange,
}: {
  value: Type;
  onChange: (value: Type) => void;
}) {
  return (
    <div>
      <Label>Filter by account type</Label>
      <Select
        value={value.toString()}
        onValueChange={(value) => onChange(Number(value))}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select an account type" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItemWithIcon
              value={MembersFilterAccountType.ANY.toString()}
              label={"Any"}
              icon={AsteriskIcon}
            />
            <SelectItemWithIcon
              value={MembersFilterAccountType.USER.toString()}
              label={"User"}
              icon={UserIcon}
            />
            <SelectItemWithIcon
              value={MembersFilterAccountType.BOT.toString()}
              label={"Bot"}
              icon={BotIcon}
            />
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
