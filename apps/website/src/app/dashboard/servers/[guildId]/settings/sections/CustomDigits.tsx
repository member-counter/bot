import { Trans } from "react-i18next";

import { cn } from "@mc/ui";
import { Label } from "@mc/ui/label";
import { LinkUnderlined } from "@mc/ui/LinkUnderlined";

import DataSourceFormatDigitInput from "../../TemplateEditor/DataSource/Format/DataSourceFormatDigitInput";

interface Props {
  readyToInitiate: boolean;
  value: string[];
  onChange: (value: string[]) => void;
  disabled: boolean;
}

export function CustomDigits({
  value,
  onChange,
  disabled,
  readyToInitiate,
}: Props) {
  return (
    <div className="flex flex-col gap-3">
      <Label>
        <Trans i18nKey="pages.dashboard.servers.settings.sections.CustomDigits.customDigits" />
      </Label>
      <p className="text-sm text-muted-foreground">
        <Trans i18nKey="pages.dashboard.servers.settings.sections.CustomDigits.customDigitsDescription" />
      </p>
      <p className="text-sm text-muted-foreground">
        <b>
          <Trans
            i18nKey="pages.dashboard.servers.settings.sections.CustomDigits.screenReaderWarning"
            components={{
              demoLink: (
                <LinkUnderlined
                  href="https://x.com/kentcdodds/status/1083073242330361856"
                  target="_blank"
                  referrerPolicy="no-referrer"
                />
              ),
            }}
          />
        </b>
      </p>
      <p className="text-sm text-muted-foreground">
        <Trans i18nKey="pages.dashboard.servers.settings.sections.CustomDigits.customizationRecommendation" />
      </p>
      <div className="grid grid-cols-3 gap-3">
        {readyToInitiate &&
          new Array(10).fill("").map((_, i) => {
            return (
              <DataSourceFormatDigitInput
                key={i}
                className={cn({ "col-span-3": i === 0 })}
                value={value[i] ?? ""}
                onChange={(digit) => {
                  value[i] = digit;
                  onChange(value);
                }}
                digitNumber={i}
                disabled={disabled}
              />
            );
          })}
      </div>
    </div>
  );
}
