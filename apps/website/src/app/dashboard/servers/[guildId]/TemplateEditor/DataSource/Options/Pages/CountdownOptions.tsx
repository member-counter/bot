import type { DataSource, DataSourceCountdown } from "@mc/common/DataSource";
import { useCallback, useEffect, useState } from "react";

import { Input } from "@mc/ui/input";
import { Label } from "@mc/ui/label";
import { Separator } from "@mc/ui/separator";

import type { SetupOptionsInterface } from "../SetupOptionsInterface";
import { Combobox } from "~/app/components/Combobox";
import { textWithDataSourceItemRendererFactory } from "~/app/components/Combobox/renderers/textWithDataSourceItem";
import { knownSearcheableDataSources } from "../../dataSourcesMetadata";
import useDataSourceOptions from "../useDataSourceOptions";

function formatCountdown(date: unknown, format: unknown) {
  if (typeof date !== "number" || typeof format !== "string") return;
  let timeLeft = new Date(date - Date.now());
  if (date - Date.now() < 0) timeLeft = new Date(0);

  return format
    .replace(/%d/gi, `${Math.floor(timeLeft.getTime() / 1000 / 60 / 60 / 24)}`)
    .replace(/%h/gi, `${timeLeft.getUTCHours()}`)
    .replace(/%m/gi, `${timeLeft.getUTCMinutes()}`)
    .replace(/%s/gi, `${timeLeft.getUTCSeconds()}`);
}

type DataSourceType = DataSourceCountdown;

const defaultOptionsMerger = (options: DataSourceType["options"] = {}) => {
  return {
    date: options.date ?? Date.now() + 60 * 60 * 1000,
    format: options.format ?? "%d days, %h hours and %m minutes left",
  };
};

export function CountdownOptions({
  options: unmergedOptions,
  onOptionsChange,
}: SetupOptionsInterface<DataSourceType>) {
  const [options, setOptions] = useDataSourceOptions({
    unmergedOptions,
    defaultOptionsMerger,
    onOptionsChange,
  });

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
        <Label>Target date</Label>
        {typeof options.date === "number" && (
          <Input
            type="datetime-local"
            value={
              options.date
                ? new Date(
                    options.date - new Date().getTimezoneOffset() * 60 * 1000,
                  )
                    .toISOString()
                    .slice(0, 16)
                : ""
            }
            onChange={(e) =>
              setOptions({
                date:
                  e.target.valueAsNumber +
                  new Date().getTimezoneOffset() * 60 * 1000,
              })
            }
          />
        )}
        <Combobox<number | DataSource>
          items={knownSearcheableDataSources}
          placeholder="Or take date from a counter..."
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
            dataSourceConfigWarning:
              "Remember to return a valid UNIX timestamp",
          })}
        />
      </div>
      <Separator />
      <div>
        <Label>Format</Label>
        <p className="text-sm font-light italic">
          Use <code>%d</code> to show the days left, <code>%h</code> for the
          hours left, and <code>%m</code> for the minutes left.
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
            dataSourceConfigWarning:
              "Remember to return a valid formatting string",
          })}
        />
      </div>
      <Separator />
      <div>
        <Label>Live preview</Label>
        {!options.date || !options.format ? (
          <span className="text-sm font-light italic">
            We can't show you a live preview when the target date or format is
            empty.
          </span>
        ) : typeof options.date !== "number" ||
          typeof options.format !== "string" ? (
          <span className="text-sm font-light italic">
            We can't show you a live preview when the target date or format is
            the result of a counter, you must preview the whole template to see
            how it will look like.
          </span>
        ) : (
          <Input readOnly value={preview} />
        )}
      </div>
    </div>
  );
}
