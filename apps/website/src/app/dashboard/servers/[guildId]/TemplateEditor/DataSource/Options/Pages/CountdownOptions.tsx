import type { DataSource, DataSourceCountdown } from "@mc/common/DataSource";
import type { TFunction } from "i18next";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Trans, useTranslation } from "react-i18next";

import { Input } from "@mc/ui/input";
import { Label } from "@mc/ui/label";
import { Separator } from "@mc/ui/separator";

import type { SetupOptionsInterface } from "../SetupOptionsInterface";
import { Combobox } from "~/app/components/Combobox";
import { textWithDataSourceItemRendererFactory } from "~/app/components/Combobox/renderers/textWithDataSourceItem";
import {
  addTimezoneOffset,
  subTimezoneOffset,
} from "~/other/fixTimezoneOffset";
import { useKnownSearcheableDataSource } from "../../metadata";
import useDataSourceOptions from "../useDataSourceOptions";

function formatCountdown(date: unknown, format: unknown) {
  if (typeof date !== "number" || typeof format !== "string") return;
  let timeLeft = new Date(date - Date.now());
  if (date - Date.now() < 0) timeLeft = new Date(0);

  return format
    .replace(/%d/g, `${Math.floor(timeLeft.getTime() / 1000 / 60 / 60 / 24)}`)
    .replace(/%h/g, `${timeLeft.getUTCHours()}`)
    .replace(/%m/g, `${timeLeft.getUTCMinutes()}`)
    .replace(/%s/g, `${timeLeft.getUTCSeconds()}`)
    .replace(/%D/g, `${Math.floor(timeLeft.getTime() / 1000 / 60 / 60 / 24)}`)
    .replace(/%H/g, `${Math.floor(timeLeft.getTime() / 1000 / 60 / 60)}`)
    .replace(/%M/g, `${Math.floor(timeLeft.getTime() / 1000 / 60)}`)
    .replace(/%S/g, `${Math.floor(timeLeft.getTime() / 1000)}`);
}

type DataSourceType = DataSourceCountdown;

const defaultOptionsMerger =
  (t: TFunction) =>
  (options: DataSourceType["options"] = {}) => {
    return {
      date: options.date ?? Date.now() + 60 * 60 * 1000,
      format:
        options.format ??
        t(
          "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.CountdownOptions.defaultFormat",
        ),
    };
  };

export function CountdownOptions({
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

  const knownSearcheableDataSources = useKnownSearcheableDataSource();

  const [preview, setPreview] = useState(
    formatCountdown(options.date, options.format),
  );

  const displayPreview = useCallback(() => {
    const formatted = formatCountdown(options.date, options.format);
    if (preview !== formatted) setPreview(formatted);
  }, [options.date, options.format, preview]);

  useEffect(() => {
    const interval = setInterval(() => {
      displayPreview();
    }, 1000);

    return () => clearInterval(interval);
  });

  useEffect(() => {
    displayPreview();
  }, [displayPreview, options.format]);

  return (
    <div>
      <div>
        <Label>
          {t(
            "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.CountdownOptions.targetDate",
          )}
        </Label>
        {typeof options.date === "number" && (
          <Input
            type="datetime-local"
            value={
              options.date
                ? subTimezoneOffset(options.date).toISOString().slice(0, 16)
                : ""
            }
            onChange={(e) =>
              setOptions({
                date: addTimezoneOffset(e.target.valueAsNumber).getTime(),
              })
            }
          />
        )}
        <Combobox<number | DataSource>
          items={knownSearcheableDataSources}
          placeholder={t(
            "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.CountdownOptions.datePlaceholder",
          )}
          selectedItem={
            typeof options.date === "number" ? undefined : options.date
          }
          onItemSelect={(date) => {
            setOptions({
              date,
            });
          }}
          onItemRender={textWithDataSourceItemRendererFactory()}
          onSelectedItemRender={textWithDataSourceItemRendererFactory({
            onUpdate: (date) => {
              setOptions({
                date,
              });
            },
            onRemove: () => {
              setOptions({
                date: undefined,
              });
            },
            dataSourceConfigWarning: t(
              "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.CountdownOptions.dateConfigWarning",
            ),
          })}
        />
      </div>
      <Separator />
      <div>
        <Label>
          {t(
            "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.CountdownOptions.format",
          )}
        </Label>
        <p className="text-sm font-light italic">
          <Trans
            i18nKey="pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.CountdownOptions.formatInstructions"
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
              "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.CountdownOptions.formatConfigWarning",
            ),
          })}
        />
      </div>
      <Separator />
      <div>
        <Label>
          {t(
            "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.CountdownOptions.livePreview",
          )}
        </Label>
        {!options.date || !options.format ? (
          <span className="text-sm font-light italic">
            {t(
              "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.CountdownOptions.noPreview",
            )}
          </span>
        ) : typeof options.date !== "number" ||
          typeof options.format !== "string" ? (
          <span className="text-sm font-light italic">
            {t(
              "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.CountdownOptions.counterPreview",
            )}
          </span>
        ) : (
          <Input readOnly value={preview} />
        )}
      </div>
    </div>
  );
}
