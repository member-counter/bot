import type { DataSourceBotStats } from "@mc/common/DataSource";
import { ServerIcon, UsersIcon } from "lucide-react";

import { BotStatsDataSourceReturn } from "@mc/common/DataSource";
import { Label } from "@mc/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from "@mc/ui/select";
import { SelectItemWithIcon } from "@mc/ui/selectItemWithIcon";

import type { SetupOptionsInterface } from "../SetupOptionsInterface";
import useDataSourceOptions from "../useDataSourceOptions";

type DataSourceType = DataSourceBotStats;

const defaultOptionsMerger = (options: DataSourceType["options"] = {}) => {
  return {
    return: options.return ?? BotStatsDataSourceReturn.USERS,
  };
};

export function BotStatsOptions({
  options: unmergedOptions,
  onOptionsChange,
}: SetupOptionsInterface<DataSourceType>) {
  const [options, setOptions] = useDataSourceOptions({
    unmergedOptions,
    defaultOptionsMerger,
    onOptionsChange,
  });

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <Label>Display</Label>
        <Select
          value={options.return.toString()}
          onValueChange={(value) => setOptions({ return: Number(value) })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select something to display" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItemWithIcon
                value={BotStatsDataSourceReturn.GUILDS.toString()}
                label={"Servers"}
                icon={ServerIcon}
              />
              <SelectItemWithIcon
                value={BotStatsDataSourceReturn.USERS.toString()}
                label={"Users"}
                icon={UsersIcon}
              />
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
