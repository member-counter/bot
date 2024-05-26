import { useId, useMemo } from "react";

import { Label } from "@mc/ui/label";

import { Combobox } from "~/app/components/Combobox";
import {
  renderLocaleItem,
  renderSelectedLocaleItem,
} from "~/app/components/Combobox/renderers/localeItemRenderer";
import { searchableLocales } from "~/other/locales";

interface Props {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}

export function Locale({ value, onChange, disabled }: Props) {
  const localeInput = useId();

  const numberFormatter = useMemo(
    () =>
      new Intl.NumberFormat(value as Intl.LocalesArgument, {
        notation: "compact",
      }),
    [value],
  );

  const timeFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(value as Intl.LocalesArgument, {
        hour: "numeric",
        minute: "numeric",
      }),
    [value],
  );
  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor={localeInput}>Locale</Label>
      <div className="text-sm text-muted-foreground">
        <p>Changing this will affect how some counters are displayed.</p>
        <ul className="ml-4 mt-1 list-disc">
          <li>
            15:30h (or 3:30 PM) will be displayed as{" "}
            {timeFormatter.format(new Date("2024 15:30"))}
          </li>
          <li>439212 will be displayed as {numberFormatter.format(439212)}</li>
        </ul>
      </div>
      <Combobox
        id={localeInput}
        allowSearchedItem
        items={searchableLocales}
        placeholder="Search locale..."
        onItemSelect={onChange}
        selectedItem={value}
        onItemRender={renderLocaleItem}
        onSelectedItemRender={renderSelectedLocaleItem}
        disabled={disabled}
      />
    </div>
  );
}
