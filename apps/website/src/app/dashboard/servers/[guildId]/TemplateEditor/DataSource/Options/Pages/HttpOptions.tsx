import type { DataSourceHTTP } from "@mc/common/DataSource";
import { useEffect, useState } from "react";
import { Loader2Icon } from "lucide-react";

import jsonBodyExtractor from "@mc/common/jsonBodyExtractor";
import { Button } from "@mc/ui/button";
import { Input } from "@mc/ui/input";
import { Label } from "@mc/ui/label";
import { Separator } from "@mc/ui/separator";

import type { SetupOptionsInterface } from "../SetupOptionsInterface";
import AutocompleteInput from "../../../../../../../components/AutocompleteInput";
import { searcheableDataSources } from "../../dataSourcesMetadata";
import useDataSourceOptions from "../useDataSourceOptions";
import { numberItemRendererFactory } from "./components/itemRenderers/numbers";
import {
  AutocompleteTextItemRenderer,
  textItemRendererFactory,
} from "./components/itemRenderers/text";

type DataSourceType = DataSourceHTTP;

const defaultOptionsMerger = (options: DataSourceType["options"] = {}) => {
  return {
    url: options.url ?? "",
    lifetime: options.lifetime,
    dataPath: options.dataPath ?? "example[0].sub",
  };
};

export function HttpOptions({
  options: unmergedOptions,
  onOptionsChange,
}: SetupOptionsInterface<DataSourceType>) {
  const [options, setOptions] = useDataSourceOptions({
    unmergedOptions,
    defaultOptionsMerger,
    onOptionsChange,
  });
  const [testResponse, setTestResponse] = useState(
    JSON.stringify(
      { example: [{ sub: 123 }, { subnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn: 789 }] },
      null,
      " ",
    ),
  );
  const [testLoading, setTestLoading] = useState(false);
  const [displayPreview, setDisplayPreview] = useState("");

  useEffect(() => {
    try {
      setDisplayPreview(
        jsonBodyExtractor(
          JSON.parse(testResponse),
          typeof options.dataPath === "string" ? options.dataPath : "",
        ),
      );
    } catch (e) {
      setDisplayPreview(e instanceof Error ? e.toString() : "Unknown error");
    }
  }, [testResponse, options.dataPath]);

  const testHTTP = () => {
    if (typeof options.url !== "string") return;

    setTestLoading(true);

    fetch(options.url)
      .then((res) => res.text())
      .then((body) => {
        try {
          setTestResponse(JSON.stringify(JSON.parse(body), null, " "));
        } catch (e) {
          setTestResponse(body);
        }
      })
      .catch((e) => {
        setTestResponse(e instanceof Error ? e.toString() : "Unknown error");
      })
      .finally(() => {
        setTestLoading(false);
      });
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <Label>URL (GET)</Label>
        {options.url &&
          [options.url].map(
            textItemRendererFactory({
              remove: () => setOptions({ url: undefined }),
              update: (url) => setOptions({ url }),
              dataSourceConfigWarning: "Remember to return a valid URL",
            }),
          )}
        {!options.url && (
          <AutocompleteInput
            itemRenderer={AutocompleteTextItemRenderer}
            placeholder=""
            onAdd={(url) => {
              setOptions({ url });
            }}
            allowSearchedItem={true}
            suggestableItems={searcheableDataSources}
          />
        )}
      </div>
      <div className="flex flex-col gap-3">
        <Label>Lifetime (in seconds)</Label>
        <span className="text-sm font-light italic">
          Specifies for how long the response of the specified URL will be
          cached.
        </span>
        {options.lifetime &&
          [options.lifetime].map(
            numberItemRendererFactory({
              remove: () => setOptions({ lifetime: undefined }),
              update: (lifetime) => setOptions({ lifetime }),
            }),
          )}
        {!options.lifetime && (
          <AutocompleteInput
            itemRenderer={AutocompleteTextItemRenderer}
            placeholder=""
            onAdd={(lifetime) => {
              if (typeof lifetime === "string") {
                if (!isNaN(Number(lifetime)))
                  setOptions({ lifetime: Number(lifetime) });
              } else {
                setOptions({ lifetime });
              }
            }}
            allowSearchedItem={true}
            suggestableItems={searcheableDataSources}
          />
        )}
      </div>
      <div className="flex flex-col gap-3">
        <Label>Data path</Label>
        <span className="text-sm font-light italic">
          A path to get the desired value when the response's content type is
          JSON, the syntax similar to the one used by JS to access properties
          and array items.
        </span>
        {options.dataPath &&
          [options.dataPath].map(
            textItemRendererFactory({
              remove: () => setOptions({ dataPath: undefined }),
              update: (dataPath) => setOptions({ dataPath }),
              dataSourceConfigWarning: "Remember to return a data path",
            }),
          )}
        {!options.dataPath && (
          <AutocompleteInput
            itemRenderer={AutocompleteTextItemRenderer}
            placeholder=""
            onAdd={(dataPath) => {
              setOptions({ dataPath });
            }}
            allowSearchedItem={true}
            suggestableItems={searcheableDataSources}
          />
        )}
      </div>

      <Separator />
      {typeof options.dataPath !== "string" ? (
        <span className="text-sm font-light italic">
          We can't show you a preview when the URL or data path is the result of
          a counter, you must preview the whole template to see how it will look
          like.
        </span>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            <Label>Test response</Label>
            <pre className="overflow-auto rounded-md border border-input bg-background p-4">
              {testResponse}
            </pre>
            <Button disabled={testLoading || !options.url} onClick={testHTTP}>
              {testLoading ? (
                <>
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />{" "}
                  Fetching...
                </>
              ) : options.url ? (
                "Fetch"
              ) : (
                "Can't fetch, URL is empty"
              )}
            </Button>
          </div>

          <div className="flex flex-col gap-3">
            <Label>Preview</Label>
            <Input readOnly value={displayPreview} />
          </div>
        </>
      )}
    </div>
  );
}
