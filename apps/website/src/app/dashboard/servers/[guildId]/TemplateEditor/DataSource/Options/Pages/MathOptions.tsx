import type { DataSourceMath } from "@mc/common/DataSource";
import {
  DivideIcon,
  MinusIcon,
  PercentIcon,
  PlusIcon,
  XIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { MathDataSourceOperation } from "@mc/common/DataSource";
import { Label } from "@mc/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from "@mc/ui/select";
import { SelectItemWithIcon } from "@mc/ui/selectItemWithIcon";
import { Separator } from "@mc/ui/separator";

import type { SetupOptionsInterface } from "../SetupOptionsInterface";
import { Combobox } from "~/app/components/Combobox";
import { textWithDataSourceItemRendererFactory } from "~/app/components/Combobox/renderers/textWithDataSourceItem";
import { addTo, removeFrom, updateIn } from "~/other/array";
import { useKnownSearcheableDataSource } from "../../metadata";
import useDataSourceOptions from "../useDataSourceOptions";

type DataSourceType = DataSourceMath;

const defaultOptionsMerger = (options: DataSourceType["options"] = {}) => {
  return {
    operation: options.operation ?? MathDataSourceOperation.ADD,
    numbers: options.numbers ?? [],
  };
};

export function MathOptions({
  options: unmergedOptions,
  onOptionsChange,
}: SetupOptionsInterface<DataSourceType>) {
  const { t } = useTranslation();
  const [options, setOptions] = useDataSourceOptions({
    unmergedOptions,
    defaultOptionsMerger,
    onOptionsChange,
  });

  const knownSearcheableDataSources = useKnownSearcheableDataSource();

  return (
    <div>
      <div>
        <Label>
          {t(
            "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.MathOptions.operation",
          )}
        </Label>
        <Select
          value={options.operation.toString()}
          onValueChange={(value) => setOptions({ operation: Number(value) })}
        >
          <SelectTrigger>
            <SelectValue
              placeholder={t(
                "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.MathOptions.selectOperation",
              )}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItemWithIcon
                value={MathDataSourceOperation.ADD.toString()}
                label={t(
                  "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.MathOptions.addition",
                )}
                icon={PlusIcon}
              />
              <SelectItemWithIcon
                value={MathDataSourceOperation.SUBTRACT.toString()}
                label={t(
                  "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.MathOptions.subtraction",
                )}
                icon={MinusIcon}
              />
              <SelectItemWithIcon
                value={MathDataSourceOperation.MULTIPLY.toString()}
                label={t(
                  "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.MathOptions.multiplication",
                )}
                icon={XIcon}
              />
              <SelectItemWithIcon
                value={MathDataSourceOperation.DIVIDE.toString()}
                label={t(
                  "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.MathOptions.division",
                )}
                icon={DivideIcon}
              />
              <SelectItemWithIcon
                value={MathDataSourceOperation.MODULO.toString()}
                label={t(
                  "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.MathOptions.modulo",
                )}
                icon={PercentIcon}
              />
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Separator />
      <div>
        <Label>
          {t(
            "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.MathOptions.numberList",
          )}
        </Label>
        {options.numbers.map((number, index) => (
          <Combobox
            key={index}
            items={knownSearcheableDataSources}
            placeholder=""
            allowSearchedTerm
            prefillSelectedItemOnSearchOnFocus
            selectedItem={
              typeof number === "number" ? number.toString() : number
            }
            onItemSelect={(item) => {
              if (typeof item === "string") {
                if (!isNaN(Number(item)))
                  setOptions({
                    numbers: updateIn(options.numbers, Number(item), index),
                  });
              } else {
                setOptions({
                  numbers: updateIn(options.numbers, item, index),
                });
              }
            }}
            onItemRender={textWithDataSourceItemRendererFactory()}
            onSelectedItemRender={textWithDataSourceItemRendererFactory({
              onUpdate: (item) => {
                if (typeof item === "string") {
                  if (!isNaN(Number(item)))
                    setOptions({
                      numbers: updateIn(options.numbers, Number(item), index),
                    });
                } else {
                  setOptions({
                    numbers: updateIn(options.numbers, item, index),
                  });
                }
              },
              onRemove: () => {
                setOptions({ numbers: removeFrom(options.numbers, index) });
              },
              dataSourceConfigWarning: t(
                "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.MathOptions.numberWarning",
              ),
            })}
          />
        ))}
        <Combobox
          items={knownSearcheableDataSources}
          placeholder={t(
            "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.MathOptions.addNumber",
          )}
          allowSearchedTerm
          onItemSelect={(item) => {
            if (typeof item === "string") {
              setOptions({ numbers: addTo(options.numbers, Number(item)) });
            } else {
              setOptions({ numbers: addTo(options.numbers, item) });
            }
          }}
          onItemRender={textWithDataSourceItemRendererFactory()}
        />
      </div>
    </div>
  );
}
