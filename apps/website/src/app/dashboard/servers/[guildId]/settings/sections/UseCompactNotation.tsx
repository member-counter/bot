import { useId } from "react";

import { Label } from "@mc/ui/label";
import { Switch } from "@mc/ui/switch";

import { useDemoFormatters } from "../DemoFormatters";

interface Props {
  value: boolean;
  onChange: (value: boolean) => void;
  disabled: boolean;
}

export function UseCompactNotation({ value, onChange, disabled }: Props) {
  const compactNotationSwitch = useId();
  const demoFormatters = useDemoFormatters();

  return (
    <div className="mt-auto flex items-center justify-between gap-2">
      <div>
        <Label htmlFor={compactNotationSwitch}>
          Use compact notation for numbers
        </Label>
        <div className="text-sm text-muted-foreground">
          <p>
            Counters that returns numbers will be displayed in a more compact
            way.
          </p>
          <ul className="ml-4 mt-1 list-disc">
            <li>
              12300 will be displayed as {demoFormatters.number.format(12300)}
            </li>
            <li>
              439212 will be displayed as {demoFormatters.number.format(439212)}
            </li>
            <li>
              1500000 will be displayed as{" "}
              {demoFormatters.number.format(1500000)}
            </li>
          </ul>
        </div>
      </div>
      <Switch
        id={compactNotationSwitch}
        checked={value}
        onCheckedChange={(checked) => onChange(!!checked)}
        disabled={disabled}
      />
    </div>
  );
}
