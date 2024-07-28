import type {
  DataSourceReplace,
  ReplaceReplacement,
} from "@mc/common/DataSource";

import { Button } from "@mc/ui/button";
import { Card } from "@mc/ui/card";
import { Label } from "@mc/ui/label";
import { Separator } from "@mc/ui/separator";

import type { SetupOptionsInterface } from "../SetupOptionsInterface";
import { Combobox } from "~/app/components/Combobox";
import { textWithDataSourceItemRendererFactory } from "~/app/components/Combobox/renderers/textWithDataSourceItem";
import { addTo, removeFrom, updateIn } from "~/other/array";
import { knownSearcheableDataSources } from "../../dataSourcesMetadata";
import useDataSourceOptions from "../useDataSourceOptions";
import { useTranslation } from "react-i18next";

type DataSourceType = DataSourceReplace;

const defaultOptionsMerger = (options: DataSourceType["options"] = {}) => {
  return {
    replacements: options.replacements ?? [],
    text: options.text ?? "",
  };
};

export function ReplaceOptions({
  options: unmergedOptions,
  onOptionsChange,
}: SetupOptionsInterface<DataSourceType>) {
  const { t } = useTranslation();
  const [options, setOptions] = useDataSourceOptions({
    unmergedOptions,
    defaultOptionsMerger,
    onOptionsChange,
  });

  return (
    <div>
      <div>
        <Label>{t('pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.ReplaceOptions.inputText')}</Label>
        <Combobox
          items={knownSearcheableDataSources}
          selectedItem={options.text}
          allowSearchedTerm
          onItemRender={textWithDataSourceItemRendererFactory()}
          onSelectedItemRender={textWithDataSourceItemRendererFactory({
            onUpdate(text) {
              setOptions({ text });
            },
            onRemove() {
              setOptions({ text: undefined });
            },
          })}
          onItemSelect={(text) => {
            setOptions({ text });
          }}
          prefillSelectedItemOnSearchOnFocus
          placeholder={t('pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.ReplaceOptions.textPlaceholder')}
        />
      </div>
      <Separator />
      <div>
        {options.replacements.map((replacement, index) => (
          <Card
            className="flex flex-col gap-5 bg-[#29252459] p-3"
            key={index}
          >
            <div className="flex flex-col gap-3">
              <Label>{t('pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.ReplaceOptions.searchFor')}</Label>
              <Combobox
                items={knownSearcheableDataSources}
                selectedItem={replacement.search}
                allowSearchedTerm
                onItemRender={textWithDataSourceItemRendererFactory()}
                onSelectedItemRender={textWithDataSourceItemRendererFactory({
                  onUpdate(text) {
                    const newReplacement: ReplaceReplacement = {
                      ...replacement,
                      search: text,
                    };
                    setOptions({
                      replacements: updateIn(
                        options.replacements,
                        newReplacement,
                        index,
                      ),
                    });
                  },
                  onRemove() {
                    const newReplacement: ReplaceReplacement = {
                      ...replacement,
                      search: undefined,
                    };
                    setOptions({
                      replacements: updateIn(
                        options.replacements,
                        newReplacement,
                        index,
                      ),
                    });
                  },
                })}
                onItemSelect={(text) => {
                  const newReplacement: ReplaceReplacement = {
                    ...replacement,
                    search: text,
                  };
                  setOptions({
                    replacements: updateIn(
                      options.replacements,
                      newReplacement,
                      index,
                    ),
                  });
                }}
                prefillSelectedItemOnSearchOnFocus
                placeholder={t('pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.ReplaceOptions.searchPlaceholder')}
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label>{t('pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.ReplaceOptions.replaceWith')}</Label>
              <Combobox
                items={knownSearcheableDataSources}
                selectedItem={replacement.replacement}
                allowSearchedTerm
                onItemRender={textWithDataSourceItemRendererFactory()}
                onSelectedItemRender={textWithDataSourceItemRendererFactory({
                  onUpdate(text) {
                    const newReplacement: ReplaceReplacement = {
                      ...replacement,
                      replacement: text,
                    };
                    setOptions({
                      replacements: updateIn(
                        options.replacements,
                        newReplacement,
                        index,
                      ),
                    });
                  },
                  onRemove() {
                    const newReplacement: ReplaceReplacement = {
                      ...replacement,
                      replacement: undefined,
                    };
                    setOptions({
                      replacements: updateIn(
                        options.replacements,
                        newReplacement,
                        index,
                      ),
                    });
                  },
                })}
                onItemSelect={(text) => {
                  const newReplacement: ReplaceReplacement = {
                    ...replacement,
                    replacement: text,
                  };
                  setOptions({
                    replacements: updateIn(
                      options.replacements,
                      newReplacement,
                      index,
                    ),
                  });
                }}
                prefillSelectedItemOnSearchOnFocus
                placeholder={t('pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.ReplaceOptions.replacementPlaceholder')}
              />
            </div>
            <Button
              variant={"destructive"}
              onClick={() =>
                setOptions({
                  replacements: removeFrom(options.replacements, index),
                })
              }
            >
              {t('pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.ReplaceOptions.removeReplacement')}
            </Button>
          </Card>
        ))}
        <Button
          variant={"secondary"}
          onClick={() =>
            setOptions({
              replacements: addTo(options.replacements, {
                search: undefined,
                replacement: undefined,
              }),
            })
          }
        >
          {t('pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.ReplaceOptions.addReplacement')}
        </Button>
      </div>
    </div>
  );
}
