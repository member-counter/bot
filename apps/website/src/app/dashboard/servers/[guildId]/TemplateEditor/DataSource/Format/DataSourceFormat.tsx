import type {
  DataSource,
  DataSourceFormatSettings,
} from "@mc/common/DataSource";
import { useId } from "react";
import { useTranslation } from "react-i18next";

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
import { localeItem } from "~/app/components/Combobox/renderers/localeItem";
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
  const { t } = useTranslation();
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
        <Label>
          {t(
            "pages.dashboard.servers.TemplateEditor.DataSource.Format.DataSourceFormat.useCompactNotation",
          )}
        </Label>
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
            <SelectValue
              placeholder={t(
                "pages.dashboard.servers.TemplateEditor.DataSource.Format.DataSourceFormat.select",
              )}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItemWithIcon
                value={"null"}
                label={t(
                  "pages.dashboard.servers.TemplateEditor.DataSource.Format.DataSourceFormat.defaultServerSettings",
                )}
              />
              <SelectItemWithIcon
                value={"true"}
                label={t(
                  "pages.dashboard.servers.TemplateEditor.DataSource.Format.DataSourceFormat.yes",
                )}
              />
              <SelectItemWithIcon
                value={"false"}
                label={t(
                  "pages.dashboard.servers.TemplateEditor.DataSource.Format.DataSourceFormat.no",
                )}
              />
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
          <Label htmlFor={defaultLocaleCheckbox}>
            {t(
              "pages.dashboard.servers.TemplateEditor.DataSource.Format.DataSourceFormat.overrideDefaultLocale",
            )}
          </Label>
        </div>
        {typeof format.locale === "string" && (
          <Combobox
            allowSearchedTerm
            items={searchableLocales}
            placeholder={t(
              "pages.dashboard.servers.TemplateEditor.DataSource.Format.DataSourceFormat.searchLocale",
            )}
            onItemSelect={(locale) => {
              setFormat({ locale });
            }}
            selectedItem={format.locale}
            onItemRender={localeItem()}
            onSelectedItemRender={localeItem()}
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
          <Label htmlFor={defaultDigitsCheckbox}>
            {t(
              "pages.dashboard.servers.TemplateEditor.DataSource.Format.DataSourceFormat.overrideDefaultDigits",
            )}
          </Label>
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
