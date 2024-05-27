import { useId, useMemo } from "react";

import { Label } from "@mc/ui/label";
import { Switch } from "@mc/ui/switch";

interface Props {
  locale: string;
  value: boolean;
  onChange: (value: boolean) => void;
  disabled: boolean;
}

export function UseCompactNotation({
  locale,
  value,
  onChange,
  disabled,
}: Props) {
  const compactNotationSwitch = useId();

  const numberFormatter = useMemo(
    () =>
      new Intl.NumberFormat(locale as Intl.LocalesArgument, {
        notation: "compact",
      }),
    [locale],
  );

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
            <li>12300 will be displayed as {numberFormatter.format(12300)}</li>
            <li>
              439212 will be displayed as {numberFormatter.format(439212)}
            </li>
            <li>
              1500000 will be displayed as {numberFormatter.format(1500000)}
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
