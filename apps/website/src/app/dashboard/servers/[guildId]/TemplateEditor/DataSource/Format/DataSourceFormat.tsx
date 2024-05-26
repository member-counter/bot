import type {
  DataSource,
  DataSourceFormatSettings,
} from "@mc/common/DataSource";
import { useId } from "react";

import { cn } from "@mc/ui";
import { Checkbox } from "@mc/ui/checkbox";
import { Input } from "@mc/ui/input";
import { Label } from "@mc/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from "@mc/ui/select";
import { SelectItemWithIcon } from "@mc/ui/selectItemWithIcon";

import { locales, searchableLocales } from "~/other/locales";
import AutocompleteInput from "../../../../../../components/AutocompleteInput";
import { TextItem } from "../Options/Pages/components/TextItem";
import useDataSourceOptions from "../Options/useDataSourceOptions";
import DataSourceFormatDigitInput from "./DataSourceFormatDigitInput";

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
  const [format, setFormat] = useDataSourceOptions({
    unmergedOptions: unmergedFormat,
    defaultOptionsMerger,
    onOptionsChange: onChangeFormat,
  });

  const defaultLocaleCheckbox = useId();
  const defaultDigitsCheckbox = useId();

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
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
      <div className="flex flex-col gap-1.5">
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
          <>
            {format.locale &&
              [format.locale].map(
                localeItemRenderer({
                  remove: () => setFormat({ locale: "" }),
                  update: (locale) => setFormat({ locale }),
                }),
              )}
            {!format.locale && (
              <AutocompleteInput
                itemRenderer={AutocompleteLocaleItemRenderer}
                placeholder="Search locale..."
                onAdd={(locale) => {
                  setFormat({ locale });
                }}
                suggestLimit={10}
                suggestableItems={searchableLocales}
                allowSearchedItem={true}
              />
            )}
          </>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
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
          <div className="grid grid-cols-3 gap-1.5">
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

export const localeItemRenderer =
  ({
    remove,
    update,
  }: {
    update?: (value: string, index: number) => void;
    remove?: (index: number) => void;
  }) =>
  (item: string, index: number) => {
    if (locales[item]) {
      return (
        <TextItem
          key={index}
          label={locales[item] ?? item}
          onClickDelete={remove && (() => remove(index))}
        />
      );
    } else {
      return (
        <Input
          key={index}
          value={item}
          onKeyDown={(event) => {
            event.currentTarget.value.length === 1 &&
              ["Delete", "Backspace"].includes(event.key) &&
              remove &&
              (() => remove(index));
          }}
          onChange={({ target: { value } }) => {
            update && update(value, index);
          }}
        />
      );
    }
  };

export const AutocompleteLocaleItemRenderer = (
  item: string,
  index: number,
  isSelected: boolean,
  onClick: () => void,
) => {
  return (
    <TextItem
      key={index}
      label={locales[item] ?? item}
      isSelected={isSelected}
      onClick={onClick}
    />
  );
};
