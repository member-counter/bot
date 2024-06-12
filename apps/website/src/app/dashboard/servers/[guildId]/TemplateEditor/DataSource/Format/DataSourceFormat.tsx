import type {
  DataSource,
  DataSourceFormatSettings,
} from "@mc/common/DataSource";
import { useId } from "react";

import { cn } from "@mc/ui";
import { Checkbox } from "@mc/ui/checkbox";
import { Label } from "@mc/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from "@mc/ui/select";
import { SelectItemWithIcon } from "@mc/ui/selectItemWithIcon";

import { Combobox } from "~/app/components/Combobox";
import { LocaleItem } from "~/app/components/Combobox/items/LocaleItem";
import { searchableLocales } from "~/other/locales";
import DataSourceFormatDigitInput from "./DataSourceFormatDigitInput";
import useDataSourceFormat from "./useDataSourceFormat";

const defaultOptionsMerger = (
  options: Partial<DataSourceFormatSettings> = {},
) => {
  return options;
};

export default function DataSourceFormat({
  format: unmergedFormat,
  onChangeFormat,
}: {
  format: Partial<DataSourceFormatSettings>;
  onChangeFormat: (formatting: DataSource["format"]) => void;
}) {
  const [format, setFormat] = useDataSourceFormat({
    unmergedOptions: unmergedFormat,
    defaultOptionsMerger,
    onOptionsChange: onChangeFormat,
  });

  const defaultLocaleCheckbox = useId();
  const defaultDigitsCheckbox = useId();

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <Label>Use compact notation</Label>
        <Select
          value={
            format.compactNotation == null
              ? "null"
              : format.compactNotation
                ? "true"
                : "false"
          }
          onValueChange={(value) =>
            setFormat({
              compactNotation: value === "null" ? null : value === "true",
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItemWithIcon
                value={"null"}
                label={"Default to server settings"}
              />
              <SelectItemWithIcon value={"true"} label={"Yes"} />
              <SelectItemWithIcon value={"false"} label={"No"} />
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id={defaultLocaleCheckbox}
            checked={format.locale != null}
            onCheckedChange={(state) =>
              setFormat({ locale: state ? "" : null })
            }
          />
          <Label htmlFor={defaultLocaleCheckbox}>Override default locale</Label>
        </div>
        {typeof format.locale === "string" && (
          <Combobox
            allowSearchedTerm
            items={searchableLocales}
            placeholder="Search locale..."
            onItemSelect={(locale) => {
              setFormat({ locale });
            }}
            selectedItem={format.locale}
            onItemRender={LocaleItem}
            onSelectedItemRender={LocaleItem}
          />
        )}
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id={defaultDigitsCheckbox}
            checked={format.digits != null}
            onCheckedChange={(state) =>
              setFormat({ digits: state ? [] : null })
            }
          />
          <Label htmlFor={defaultDigitsCheckbox}>Override default digits</Label>
        </div>
        {format.digits != null && (
          <div className="grid grid-cols-3 gap-3">
            {new Array(10).fill("").map((_, i) => {
              return (
                <DataSourceFormatDigitInput
                  key={i}
                  className={cn({ "col-span-3": i === 0 })}
                  value={format.digits?.[i] ?? ""}
                  onChange={(digit) => {
                    const digits: (string | null)[] = format.digits ?? [];
                    digits[i] = digit || null;
                    setFormat({ digits });
                  }}
                  digitNumber={i}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
