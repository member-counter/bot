import type { DataSource, DataSourceClock } from "@mc/common/DataSource";
import type { TFunction } from "i18next";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Trans, useTranslation } from "react-i18next";

import { Input } from "@mc/ui/input";
import { Label } from "@mc/ui/label";
import { Separator } from "@mc/ui/separator";

import type { Searchable } from "../../../../../../../components/Combobox";
import type { SetupOptionsInterface } from "../SetupOptionsInterface";
import { textWithDataSourceItemRendererFactory } from "~/app/components/Combobox/renderers/textWithDataSourceItem";
import { timezoneWithDataSourceItem } from "~/app/components/Combobox/renderers/timezoneWithDataSourceItem";
import { searchableTimezones } from "~/other/timezones";
import { Combobox } from "../../../../../../../components/Combobox";
import {
  useKnownSearcheableDataSource,
  useSearcheableDataSource,
} from "../../metadata";
import useDataSourceOptions from "../useDataSourceOptions";

function formatClock(timezone: unknown, format: unknown) {
  if (typeof format !== "string") return;

  const coeff = 1000 * 60 * 5;
  const date = new Date();
  const rounded = new Date(Math.round(date.getTime() / coeff) * coeff);

  // If format is %f, use default Intl formatting
  if (format === "%f") {
    return new Intl.DateTimeFormat(undefined, {
      hour: "numeric",
      minute: "numeric",
      timeZone: typeof timezone === "string" ? timezone : undefined,
    }).format(rounded);
  }

  // Get time parts in the specified timezone
  const timeInTimezone = new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: typeof timezone === "string" ? timezone : undefined,
  });

  const parts = timeInTimezone.formatToParts(rounded);
  const hour = parts.find((p) => p.type === "hour")?.value ?? "";
  const minute = parts.find((p) => p.type === "minute")?.value ?? "";
  const second = parts.find((p) => p.type === "second")?.value ?? "";

  // Get 12-hour format
  const time12 = new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZone: typeof timezone === "string" ? timezone : undefined,
  });

  const parts12 = time12.formatToParts(rounded);
  const hour12 = parts12.find((p) => p.type === "hour")?.value ?? "";
  const dayPeriod = parts12.find((p) => p.type === "dayPeriod")?.value ?? "";

  // Replace format placeholders
  const formatted = format
    .replace(/%H/g, hour) // Hour with leading zero, 24-hour format (00-23)
    .replace(/%h/g, () => String(parseInt(hour, 10))) // Hour without leading zero, 24-hour format (0-23)
    .replace(/%I/g, hour12) // Hour with leading zero, 12-hour format (01-12)
    .replace(/%i/g, () => String(parseInt(hour12, 10))) // Hour without leading zero, 12-hour format (1-12)
    .replace(/%M/g, minute) // Minute with leading zero (00-59)
    .replace(/%m/g, () => String(parseInt(minute, 10))) // Minute without leading zero (0-59)
    .replace(/%S/g, second) // Second with leading zero (00-59)
    .replace(/%s/g, () => String(parseInt(second, 10))) // Second without leading zero (0-59)
    .replace(/%p/g, dayPeriod.toLowerCase()) // am/pm
    .replace(/%P/g, dayPeriod.toUpperCase()); // AM/PM

  return formatted;
}

type DataSourceType = DataSourceClock;

const defaultOptionsMerger =
  (t: TFunction) =>
  (options: DataSourceType["options"] = {}) => {
    return {
      timezone: options.timezone,
      format:
        options.format ??
        t(
          "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.ClockOptions.defaultFormat",
        ),
    };
  };

export function ClockOptions({
  options: unmergedOptions,
  onOptionsChange,
}: SetupOptionsInterface<DataSourceType>) {
  const { t } = useTranslation();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const defaultOptionsMergerT = useMemo(() => defaultOptionsMerger(t), []);
  const [options, setOptions] = useDataSourceOptions({
    unmergedOptions,
    defaultOptionsMerger: defaultOptionsMergerT,
    onOptionsChange,
  });
  const searcheableDataSources = useSearcheableDataSource();
  const knownSearcheableDataSources = useKnownSearcheableDataSource();

  const searchableTimezonesAndDataSources: Searchable<string | DataSource>[] =
    useMemo(
      () => [...searchableTimezones, ...searcheableDataSources],
      [searcheableDataSources],
    );

  const [preview, setPreview] = useState(
    formatClock(options.timezone, options.format),
  );

  const displayPreview = useCallback(() => {
    const formatted = formatClock(options.timezone, options.format);
    if (preview !== formatted) setPreview(formatted);
  }, [options.timezone, options.format, preview]);

  useEffect(() => {
    const interval = setInterval(() => {
      displayPreview();
    }, 1000);

    return () => clearInterval(interval);
  });

  useEffect(() => {
    displayPreview();
  }, [displayPreview, options.format, options.timezone]);

  return (
    <div>
      <div>
        <Label>
          {t(
            "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.ClockOptions.timezone",
          )}
        </Label>
        <Combobox
          items={searchableTimezonesAndDataSources}
          placeholder={t(
            "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.ClockOptions.searchTimezonePlaceholder",
          )}
          selectedItem={options.timezone}
          onItemSelect={(item) => {
            setOptions({
              timezone: item,
            });
          }}
          onItemRender={timezoneWithDataSourceItem()}
          onSelectedItemRender={timezoneWithDataSourceItem({
            onUpdate: (item) => {
              setOptions({
                timezone: item,
              });
            },
            onRemove: () => {
              setOptions({
                timezone: undefined,
              });
            },
            dataSourceConfigWarning: t(
              "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.ClockOptions.configWarning",
            ),
          })}
        />
      </div>
      <Separator />
      <div>
        <Label>
          {t(
            "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.ClockOptions.format",
          )}
        </Label>
        <p className="whitespace-pre-wrap text-sm font-light italic">
          <Trans
            i18nKey="pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.ClockOptions.formatInstructions"
            components={{ code: <code /> }}
          />
        </p>
        <Combobox
          items={knownSearcheableDataSources}
          allowSearchedTerm
          placeholder=""
          prefillSelectedItemOnSearchOnFocus
          selectedItem={options.format}
          onItemSelect={(format) => {
            setOptions({
              format,
            });
          }}
          onItemRender={textWithDataSourceItemRendererFactory()}
          onSelectedItemRender={textWithDataSourceItemRendererFactory({
            onUpdate: (format) => {
              setOptions({
                format,
              });
            },
            onRemove: () => {
              setOptions({
                format: undefined,
              });
            },
            dataSourceConfigWarning: t(
              "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.ClockOptions.formatConfigWarning",
            ),
          })}
        />
      </div>
      <Separator />
      <div>
        <Label>
          {t(
            "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.ClockOptions.livePreview",
          )}
        </Label>
        {!options.format ? (
          <span className="text-sm font-light italic">
            {t(
              "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.ClockOptions.noPreview",
            )}
          </span>
        ) : typeof options.format !== "string" ? (
          <span className="text-sm font-light italic">
            {t(
              "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.ClockOptions.counterPreview",
            )}
          </span>
        ) : (
          <Input readOnly value={preview} />
        )}
      </div>
    </div>
  );
}
