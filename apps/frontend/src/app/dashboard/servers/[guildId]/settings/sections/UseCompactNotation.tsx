import { useId } from "react";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  return (
    <div className="mt-auto flex items-center justify-between gap-2">
      <div>
        <Label htmlFor={compactNotationSwitch}>
          {t(
            "pages.dashboard.servers.settings.sections.UseCompactNotation.label",
          )}
        </Label>
        <div className="text-sm text-muted-foreground">
          <p>
            {t(
              "pages.dashboard.servers.settings.sections.UseCompactNotation.description",
            )}
          </p>
          <ul className="ml-4 mt-1 list-disc">
            <li>
              {t(
                "pages.dashboard.servers.settings.sections.UseCompactNotation.example1",
                {
                  number: demoFormatters.number.format(12300),
                },
              )}
            </li>
            <li>
              {t(
                "pages.dashboard.servers.settings.sections.UseCompactNotation.example2",
                {
                  number: demoFormatters.number.format(439212),
                },
              )}
            </li>
            <li>
              {t(
                "pages.dashboard.servers.settings.sections.UseCompactNotation.example3",
                {
                  number: demoFormatters.number.format(1500000),
                },
              )}
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
