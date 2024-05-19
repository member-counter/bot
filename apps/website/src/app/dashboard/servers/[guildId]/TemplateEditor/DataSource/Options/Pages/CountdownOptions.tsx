import type { DataSourceCountdown } from "@mc/common/DataSource";
import { useCallback, useEffect, useState } from "react";

import { Input } from "@mc/ui/input";
import { Label } from "@mc/ui/label";

import type { SetupOptionsInterface } from "../SetupOptionsInterface";
import AutocompleteInput from "../../../../../../../components/AutocompleteInput";
import { searcheableDataSources } from "../../dataSourcesMetadata";
import useDataSourceOptions from "../useDataSourceOptions";
import { textItemRendererFactory } from "./components/itemRenderers/text";
import { AutocompleteTextReadonlyItemRenderer } from "./components/itemRenderers/textReadonly";

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
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
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
        {typeof options.date !== "number" &&
          [options.date].map(
            textItemRendererFactory({
              remove: () => setOptions({ date: Date.now() + 60 * 60 * 1000 }),
              update: (date) =>
                typeof date !== "string" && setOptions({ date }),
              dataSourceConfigWarning:
                "Remember to return a valid UNIX timestamp",
            }),
          )}
        {typeof options.date === "number" && (
          <AutocompleteInput
            itemRenderer={AutocompleteTextReadonlyItemRenderer}
            placeholder="Or set a counter..."
            onAdd={(date) => {
              typeof date !== "string" && setOptions({ date });
            }}
            suggestableItems={searcheableDataSources}
          />
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>Format</Label>
        <p className="text-sm font-light italic">
          Use <code>%d</code> to show the days left, <code>%h</code> for the
          hours left, and <code>%m</code> for the minutes left.
        </p>
        {options.format &&
          [options.format].map(
            textItemRendererFactory({
              remove: () => setOptions({ format: undefined }),
              update: (format) => setOptions({ format }),
              dataSourceConfigWarning: "Remember to return a valid format",
            }),
          )}
        {!options.format && (
          <AutocompleteInput
            itemRenderer={AutocompleteTextReadonlyItemRenderer}
            placeholder=""
            onAdd={(format) => {
              setOptions({ format });
            }}
            allowSearchedItem={true}
            suggestableItems={searcheableDataSources}
          />
        )}
      </div>
      <div className="flex flex-col gap-1.5">
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
