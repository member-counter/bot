import type {
  DataSourceReplace,
  ReplaceReplacement,
} from "@mc/common/DataSource";

import { Button } from "@mc/ui/button";
import { Card } from "@mc/ui/card";
import { Label } from "@mc/ui/label";
import { Separator } from "@mc/ui/separator";

import type { SetupOptionsInterface } from "../SetupOptionsInterface";
import AutocompleteInput from "~/app/components/AutocompleteInput";
import { addTo, removeFrom, updateIn } from "~/other/array";
import { searcheableDataSources } from "../../dataSourcesMetadata";
import useDataSourceOptions from "../useDataSourceOptions";
import { textItemRendererFactory } from "./components/itemRenderers/text";
import { AutocompleteTextReadonlyItemRenderer } from "./components/itemRenderers/textReadonly";

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
  const [options, setOptions] = useDataSourceOptions({
    unmergedOptions,
    defaultOptionsMerger,
    onOptionsChange,
  });

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3">
        <Label>Input text</Label>
        {options.text &&
          [options.text].map(
            textItemRendererFactory({
              remove: () => setOptions({ text: undefined }),
              update: (text) => setOptions({ text }),
              dataSourceConfigWarning: "Remember to return a valid channel URL",
            }),
          )}
        {!options.text && (
          <AutocompleteInput
            itemRenderer={AutocompleteTextReadonlyItemRenderer}
            placeholder=""
            onAdd={(text) => {
              setOptions({ text });
            }}
            allowSearchedItem={true}
            suggestableItems={searcheableDataSources}
          />
        )}
      </div>
      <Separator />
      <div className="flex flex-col gap-3">
        {options.replacements.map((replacement, index) => {
          return (
            <Card
              className="flex flex-col gap-5 bg-[#29252459] p-3"
              key={index}
            >
              <div className="flex flex-col gap-3">
                <Label>Search for</Label>
                {replacement.search &&
                  [replacement.search].map(
                    textItemRendererFactory({
                      remove: () => {
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
                      update: (text) => {
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
                    }),
                  )}
                {!replacement.search && (
                  <AutocompleteInput
                    itemRenderer={AutocompleteTextReadonlyItemRenderer}
                    placeholder=""
                    onAdd={(text) => {
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
                    allowSearchedItem={true}
                    suggestableItems={searcheableDataSources}
                  />
                )}
              </div>
              <div className="flex flex-col gap-3">
                <Label>Replace with</Label>
                {replacement.replacement &&
                  [replacement.replacement].map(
                    textItemRendererFactory({
                      remove: () => {
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
                      update: (text) => {
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
                    }),
                  )}
                {!replacement.replacement && (
                  <AutocompleteInput
                    itemRenderer={AutocompleteTextReadonlyItemRenderer}
                    placeholder=""
                    onAdd={(text) => {
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
                    allowSearchedItem={true}
                    suggestableItems={searcheableDataSources}
                  />
                )}
              </div>
              <Button
                variant={"destructive"}
                onClick={() =>
                  setOptions({
                    replacements: removeFrom(options.replacements, index),
                  })
                }
              >
                Remove replacement
              </Button>
            </Card>
          );
        })}
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
          Add replacement
        </Button>
      </div>
    </div>
  );
}
