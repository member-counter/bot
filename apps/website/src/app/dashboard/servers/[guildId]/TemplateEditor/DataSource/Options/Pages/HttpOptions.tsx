import type { DataSourceHTTP } from "@mc/common/DataSource";
import { useEffect, useState } from "react";
import { Loader2Icon } from "lucide-react";
import { useTranslation } from "react-i18next";

import jsonBodyExtractor from "@mc/common/jsonBodyExtractor";
import { Button } from "@mc/ui/button";
import { Input } from "@mc/ui/input";
import { Label } from "@mc/ui/label";
import { Separator } from "@mc/ui/separator";

import type { SetupOptionsInterface } from "../SetupOptionsInterface";
import { Combobox } from "~/app/components/Combobox";
import { textWithDataSourceItemRendererFactory } from "~/app/components/Combobox/renderers/textWithDataSourceItem";
import { useKnownSearcheableDataSource } from "../../metadata";
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
  const { t } = useTranslation();
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

  const knownSearcheableDataSources = useKnownSearcheableDataSource();

  useEffect(() => {
    try {
      setDisplayPreview(
        jsonBodyExtractor(
          JSON.parse(testResponse),
          typeof options.dataPath === "string" ? options.dataPath : "",
        ),
      );
    } catch (e) {
      setDisplayPreview(
        e instanceof Error ? e.toString() : t("common.unknownError"),
      );
    }
  }, [testResponse, options.dataPath, t]);

  const testHTTP = () => {
    if (typeof options.url !== "string") return;

    setTestLoading(true);

    fetch(options.url)
      .then((res) => res.text())
      .then((body) => {
        try {
          setTestResponse(JSON.stringify(JSON.parse(body), null, " "));
        } catch {
          setTestResponse(body);
        }
      })
      .catch((e) => {
        setTestResponse(
          e instanceof Error ? e.toString() : t("common.unknownError"),
        );
      })
      .finally(() => {
        setTestLoading(false);
      });
  };

  return (
    <div>
      <div>
        <Label>
          {t(
            "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.HttpOptions.url",
          )}
        </Label>
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
            dataSourceConfigWarning: t(
              "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.HttpOptions.urlWarning",
            ),
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
        <Label>
          {t(
            "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.HttpOptions.lifetime",
          )}
        </Label>
        <span className="text-sm font-light italic">
          {t(
            "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.HttpOptions.lifetimeDescription",
          )}
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
            dataSourceConfigWarning: t(
              "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.HttpOptions.lifetimeWarning",
            ),
          })}
        />
      </div>
      <Separator />
      <div>
        <Label>
          {t(
            "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.HttpOptions.dataPath",
          )}
        </Label>
        <span className="text-sm font-light italic">
          {t(
            "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.HttpOptions.dataPathDescription",
          )}
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
            dataSourceConfigWarning: t(
              "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.HttpOptions.dataPathWarning",
            ),
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
          {t(
            "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.HttpOptions.noPreview",
          )}
        </span>
      ) : (
        <>
          <div>
            <Label>
              {t(
                "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.HttpOptions.testResponse",
              )}
            </Label>
            <pre className="overflow-auto rounded-md border border-input bg-background p-4">
              {testResponse}
            </pre>
            <Button disabled={testLoading || !options.url} onClick={testHTTP}>
              {testLoading ? (
                <>
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />{" "}
                  {t(
                    "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.HttpOptions.fetching",
                  )}
                </>
              ) : options.url ? (
                t(
                  "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.HttpOptions.fetch",
                )
              ) : (
                t(
                  "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.HttpOptions.emptyUrl",
                )
              )}
            </Button>
          </div>
          <Separator />
          <div>
            <Label>
              {t(
                "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.HttpOptions.preview",
              )}
            </Label>
            <Input readOnly value={displayPreview} />
          </div>
        </>
      )}
    </div>
  );
}
