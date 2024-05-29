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
import { addTo, removeFrom, updateIn } from "~/other/array";
import { searcheableDataSources } from "../../dataSourcesMetadata";
import useDataSourceOptions from "../useDataSourceOptions";

type DataSourceType = DataSourceMath;

const defaultOptionsMerger = (options: DataSourceType["options"] = {}) => {
  return {
    operation: options.operation ?? MathDataSourceOperation.ADD,
    numbers: options.numbers ?? [],
  };
};

// TODO use new combobox
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
        {options.numbers.map(
          numberItemRendererFactory({
            remove: (index) =>
              setOptions({ numbers: removeFrom(options.numbers, index) }),
            update: (item, index: number) =>
              setOptions({
                numbers: updateIn(options.numbers, item, index),
              }),
          }),
        )}
        <Combobox
          itemRenderer={AutocompleteNumberItemRenderer}
          allowSearchedItem={true}
          placeholder="Add number..."
          onAdd={(item) => {
            if (typeof item === "string") {
              if (!isNaN(Number(item)))
                setOptions({ numbers: addTo(options.numbers, Number(item)) });
            } else {
              setOptions({ numbers: addTo(options.numbers, item) });
            }
          }}
          suggestOnFocus={false}
          suggestableItems={searcheableDataSources}
        />
      </div>
    </div>
  );
}
