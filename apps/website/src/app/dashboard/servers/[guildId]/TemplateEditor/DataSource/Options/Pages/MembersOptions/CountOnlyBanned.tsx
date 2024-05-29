import { useId } from "react";

import { Checkbox } from "@mc/ui/checkbox";
import { Label } from "@mc/ui/label";

type Type = boolean;
export function CountOnlyBanned({
  value,
  onChange,
}: {
  value: Type;
  onChange: (value: Type) => void;
}) {
  const bannedCheckboxId = useId();

  return (
    <div>
      <div className="flex items-center gap-2">
        <Checkbox
          id={bannedCheckboxId}
          checked={value}
          onCheckedChange={(state) => onChange(Boolean(state))}
        />
        <Label htmlFor={bannedCheckboxId}>Count only banned members</Label>
      </div>
    </div>
  );
}
