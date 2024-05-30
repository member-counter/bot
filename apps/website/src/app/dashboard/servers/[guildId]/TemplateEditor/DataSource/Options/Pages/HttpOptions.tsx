import type { DataSourceHTTP } from "@mc/common/DataSource";
import { useEffect, useState } from "react";
import { Loader2Icon } from "lucide-react";

import jsonBodyExtractor from "@mc/common/jsonBodyExtractor";
import { Button } from "@mc/ui/button";
import { Input } from "@mc/ui/input";
import { Label } from "@mc/ui/label";
import { Separator } from "@mc/ui/separator";

import type { SetupOptionsInterface } from "../SetupOptionsInterface";
import { Combobox } from "~/app/components/Combobox";
import { textWithDataSourceItemRendererFactory } from "~/app/components/Combobox/renderers/textWithDataSourceItem";
import { knownSearcheableDataSources } from "../../dataSourcesMetadata";
import useDataSourceOptions from "../useDataSourceOptions";

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
    JSON.stringify({ example: [{ sub: 123 }, { sub: 789 }] }, null, " "),
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
    <div>
      <div>
        <Label>URL (GET)</Label>
        <Combobox
          items={knownSearcheableDataSources}
          selectedItem={options.url}
          allowSearchedTerm
          onItemRender={textWithDataSourceItemRendererFactory()}
          onSelectedItemRender={textWithDataSourceItemRendererFactory({
            onUpdate(url) {
              setOptions({ url });
            },
            onRemove() {
              setOptions({ url: undefined });
            },
            dataSourceConfigWarning: "Remember to return a valid URL",
          })}
          onItemSelect={(url) => {
            setOptions({ url });
          }}
          prefillSelectedItemOnSearchOnFocus
          placeholder=""
        />
      </div>
      <Separator />
      <div>
        <Label>Lifetime (in seconds)</Label>
        <span className="text-sm font-light italic">
          Specifies for how long the response of the specified URL will be
          cached.
        </span>
        <Combobox
          items={knownSearcheableDataSources}
          placeholder=""
          allowSearchedTerm
          prefillSelectedItemOnSearchOnFocus
          selectedItem={
            typeof options.lifetime === "number"
              ? options.lifetime.toString()
              : options.lifetime
          }
          onItemSelect={(item) => {
            if (typeof item === "string") {
              if (!isNaN(Number(item)))
                setOptions({
                  lifetime: Number(item),
                });
            } else {
              setOptions({
                lifetime: item,
              });
            }
          }}
          onItemRender={textWithDataSourceItemRendererFactory()}
          onSelectedItemRender={textWithDataSourceItemRendererFactory({
            onUpdate: (item) => {
              if (typeof item === "string") {
                if (!isNaN(Number(item)))
                  setOptions({
                    lifetime: Number(item),
                  });
              } else {
                setOptions({
                  lifetime: item,
                });
              }
            },
            onRemove: () => {
              setOptions({ lifetime: undefined });
            },
            dataSourceConfigWarning: "Remember to return a valid number",
          })}
        />
      </div>
      <Separator />
      <div>
        <Label>Data path</Label>
        <span className="text-sm font-light italic">
          A path to get the desired value when the response's content type is
          JSON, the syntax similar to the one used by JS to access properties
          and array items.
        </span>
        <Combobox
          items={knownSearcheableDataSources}
          selectedItem={options.dataPath}
          allowSearchedTerm
          onItemRender={textWithDataSourceItemRendererFactory()}
          onSelectedItemRender={textWithDataSourceItemRendererFactory({
            onUpdate(dataPath) {
              setOptions({ dataPath });
            },
            onRemove() {
              setOptions({ dataPath: undefined });
            },
            dataSourceConfigWarning: "Remember to return a data path",
          })}
          onItemSelect={(dataPath) => {
            setOptions({ dataPath });
          }}
          prefillSelectedItemOnSearchOnFocus
          placeholder=""
        />
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
          <div>
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
          <Separator />
          <div>
            <Label>Preview</Label>
            <Input readOnly value={displayPreview} />
          </div>
        </>
      )}
    </div>
  );
}
