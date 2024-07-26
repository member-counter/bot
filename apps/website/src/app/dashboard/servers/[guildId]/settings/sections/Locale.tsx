import { useId } from "react";
import { useTranslation } from "react-i18next";

import { Label } from "@mc/ui/label";

import { Combobox } from "~/app/components/Combobox";
import { localeItem } from "~/app/components/Combobox/renderers/localeItem";
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
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor={localeInput}>
        {t("pages.dashboard.servers.settings.sections.Locale.locale")}
      </Label>
      <div className="text-sm text-muted-foreground">
        <p>
          {t("pages.dashboard.servers.settings.sections.Locale.description")}
        </p>
        <ul className="ml-4 mt-1 list-disc">
          <li>
            {t("pages.dashboard.servers.settings.sections.Locale.timeExample", {
              time: demoFormatters.date.format(new Date("2024 15:30")),
            })}
          </li>
          <li>
            {t(
              "pages.dashboard.servers.settings.sections.Locale.numberExample",
              { number: demoFormatters.number.format(439212) },
            )}
          </li>
        </ul>
      </div>
      <Combobox
        id={localeInput}
        items={searchableLocales}
        allowSearchedTerm
        placeholder={t(
          "pages.dashboard.servers.settings.sections.Locale.searchPlaceholder",
        )}
        selectedItem={value}
        onItemSelect={onChange}
        onItemRender={localeItem()}
        onSelectedItemRender={localeItem()}
        disabled={disabled}
      />
    </div>
  );
}
