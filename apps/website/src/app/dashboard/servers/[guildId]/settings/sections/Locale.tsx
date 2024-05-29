import { useId } from "react";

import { Label } from "@mc/ui/label";

import { Combobox } from "~/app/components/Combobox";
import { LocaleItem } from "~/app/components/Combobox/items/LocaleItem";
import { searchableLocales } from "~/other/locales";
import { useDemoFormatters } from "../DemoFormatters";

interface Props {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}

export function Locale({ value, onChange, disabled }: Props) {
  const localeInput = useId();
  const demoFormatters = useDemoFormatters();

  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor={localeInput}>Locale</Label>
      <div className="text-sm text-muted-foreground">
        <p>Changing this will affect how some counters are displayed.</p>
        <ul className="ml-4 mt-1 list-disc">
          <li>
            15:30h (or 3:30 PM) will be displayed as{" "}
            {demoFormatters.date.format(new Date("2024 15:30"))}
          </li>
          <li>
            439212 will be displayed as {demoFormatters.number.format(439212)}
          </li>
        </ul>
      </div>
      <Combobox
        id={localeInput}
        items={searchableLocales}
        allowSearchedTerm
        placeholder="Search locale..."
        selectedItem={value}
        onItemSelect={onChange}
        onItemRender={LocaleItem}
        onSelectedItemRender={LocaleItem}
        disabled={disabled}
      />
    </div>
  );
}
