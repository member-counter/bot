import type { DataSourceMath } from "@mc/common/DataSource";
import {
  DivideIcon,
  MinusIcon,
  PercentIcon,
  PlusIcon,
  XIcon,
} from "lucide-react";

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
import { knownSearcheableDataSources } from "../../dataSourcesMetadata";
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
  const [options, setOptions] = useDataSourceOptions({
    unmergedOptions,
    defaultOptionsMerger,
    onOptionsChange,
  });

  return (
    <div>
      <div>
        <Label>Operation type</Label>
        <Select
          value={options.operation.toString()}
          onValueChange={(value) => setOptions({ operation: Number(value) })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a operation type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItemWithIcon
                value={MathDataSourceOperation.ADD.toString()}
                label={"Addition"}
                icon={PlusIcon}
              />
              <SelectItemWithIcon
                value={MathDataSourceOperation.SUBSTRACT.toString()}
                label={"Substraction"}
                icon={MinusIcon}
              />
              <SelectItemWithIcon
                value={MathDataSourceOperation.MULTIPLY.toString()}
                label={"Multiplication"}
                icon={XIcon}
              />
              <SelectItemWithIcon
                value={MathDataSourceOperation.DIVIDE.toString()}
                label={"Division"}
                icon={DivideIcon}
              />
              <SelectItemWithIcon
                value={MathDataSourceOperation.MODULO.toString()}
                label={"Modulo (Reminder of a division)"}
                icon={PercentIcon}
              />
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Separator />
      <div>
        <Label>Number list</Label>
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
              dataSourceConfigWarning: "Remember to return a valid number",
            })}
          />
        ))}
        <Combobox
          items={knownSearcheableDataSources}
          placeholder="Add number..."
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
