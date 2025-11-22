import type { DataSource, DataSourceDate } from "@mc/common/DataSource";
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

function formatDate(timezone: unknown, format: unknown) {
  if (typeof format !== "string") return;

  const coeff = 1000 * 60 * 5;
  const date = new Date();
  const rounded = new Date(Math.round(date.getTime() / coeff) * coeff);

  // If format is %f, use default Intl formatting
  if (format === "%f") {
    return new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: typeof timezone === "string" ? timezone : undefined,
    }).format(rounded);
  }

  // Get date parts in the specified timezone
  const dateInTimezone = new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: typeof timezone === "string" ? timezone : undefined,
  });

  const parts = dateInTimezone.formatToParts(rounded);
  const year = parts.find((p) => p.type === "year")?.value ?? "";
  const month = parts.find((p) => p.type === "month")?.value ?? "";
  const day = parts.find((p) => p.type === "day")?.value ?? "";

  // Get month name
  const monthName = () =>
    new Intl.DateTimeFormat(undefined, {
      month: "long",
      timeZone: typeof timezone === "string" ? timezone : undefined,
    }).format(rounded);

  const monthNameShort = () =>
    new Intl.DateTimeFormat(undefined, {
      month: "short",
      timeZone: typeof timezone === "string" ? timezone : undefined,
    }).format(rounded);

  // Get day of week
  const weekdayName = () =>
    new Intl.DateTimeFormat(undefined, {
      weekday: "long",
      timeZone: typeof timezone === "string" ? timezone : undefined,
    }).format(rounded);

  const weekdayNameShort = () =>
    new Intl.DateTimeFormat(undefined, {
      weekday: "short",
      timeZone: typeof timezone === "string" ? timezone : undefined,
    }).format(rounded);

  // Get day of week number (0=Sunday, 6=Saturday)
  const dayOfWeek = () =>
    new Date(
      rounded.toLocaleString("en-US", {
        timeZone: typeof timezone === "string" ? timezone : undefined,
      }),
    )
      .getDay()
      .toString();

  // Replace format placeholders
  const formatted = format
    .replace(/%Y/g, year) // Full year (e.g., 2025)
    .replace(/%y/g, () => year.slice(-2)) // 2-digit year (e.g., 25)
    .replace(/%Ms/g, monthName) // Full month name (e.g., November)
    .replace(/%ms/g, monthNameShort) // Short month name (e.g., Nov)
    .replace(/%M/g, month) // Month number with leading zero (e.g., 01, 11)
    .replace(/%m/g, String(parseInt(month, 10))) // Month number without leading zero (e.g., 1, 11)
    .replace(/%Ws/g, weekdayName) // Full day of week name (e.g., Monday)
    .replace(/%ws/g, weekdayNameShort) // Short day of week name (e.g., Mon)
    .replace(/%w/g, dayOfWeek) // Day of week number (0=Sunday, 6=Saturday)
    .replace(/%D/g, day) // Day with leading zero (e.g., 05)
    .replace(/%d/g, String(parseInt(day, 10))); // Day without leading zero (e.g., 5)

  return formatted;
}

type DataSourceType = DataSourceDate;

const defaultOptionsMerger =
  (t: TFunction) =>
  (options: DataSourceType["options"] = {}) => {
    return {
      timezone: options.timezone,
      format:
        options.format ??
        t(
          "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.DateOptions.defaultFormat",
        ),
    };
  };

export function DateOptions({
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
    formatDate(options.timezone, options.format),
  );

  const displayPreview = useCallback(() => {
    const formatted = formatDate(options.timezone, options.format);
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
            "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.DateOptions.timezone",
          )}
        </Label>
        <Combobox
          items={searchableTimezonesAndDataSources}
          placeholder={t(
            "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.DateOptions.searchTimezonePlaceholder",
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
              "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.DateOptions.configWarning",
            ),
          })}
        />
      </div>
      <Separator />
      <div>
        <Label>
          {t(
            "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.DateOptions.format",
          )}
        </Label>
        <p className="whitespace-pre-wrap text-sm font-light italic">
          <Trans
            i18nKey="pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.DateOptions.formatInstructions"
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
              "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.DateOptions.formatConfigWarning",
            ),
          })}
        />
      </div>
      <Separator />
      <div>
        <Label>
          {t(
            "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.DateOptions.livePreview",
          )}
        </Label>
        {!options.format ? (
          <span className="text-sm font-light italic">
            {t(
              "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.DateOptions.noPreview",
            )}
          </span>
        ) : typeof options.format !== "string" ? (
          <span className="text-sm font-light italic">
            {t(
              "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.DateOptions.counterPreview",
            )}
          </span>
        ) : (
          <Input readOnly value={preview} />
        )}
      </div>
    </div>
  );
}
