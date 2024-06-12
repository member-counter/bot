import type { DataSourceMembers } from "@mc/common/DataSource";

import {
  FilterMode,
  MembersFilterAccountType,
  MembersFilterStatus,
} from "@mc/common/DataSource";
import { Label } from "@mc/ui/label";
import { Separator } from "@mc/ui/separator";

import type { SetupOptionsInterface } from "../../SetupOptionsInterface";
import useDataSourceOptions from "../../useDataSourceOptions";
import { CountOnlyBanned } from "./CountOnlyBanned";
import { FilterByAccountType } from "./FilterByAccountType";
import { FilterByConnectedTo } from "./FilterByConnectedTo";
import { FilterByRole } from "./FilterByRole";
import { FilterByRoleFilterMode } from "./FilterByRoleFilterType";
import { FilterByStatus } from "./FilterByStatus";
import { FilterPlayingGame } from "./FilterPlayingGame";

type DataSourceType = DataSourceMembers;

const defaultOptionsMerger = (options: DataSourceType["options"] = {}) => {
  return {
    statusFilter: options.statusFilter ?? MembersFilterStatus.ANY,
    accountTypeFilter:
      options.accountTypeFilter ?? MembersFilterAccountType.ANY,
    bannedMembers: options.bannedMembers ?? false,
    playing: options.playing ?? [],
    roles: options.roles ?? [],
    connectedTo: options.connectedTo ?? [],
    roleFilterMode: options.roleFilterMode ?? FilterMode.OR,
  };
};

export function MembersOptions({
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
      <CountOnlyBanned
        value={options.bannedMembers}
        onChange={(value) => setOptions({ bannedMembers: value })}
      />
      {!options.bannedMembers && (
        <>
          <Separator />
          <FilterByStatus
            value={options.statusFilter}
            onChange={(value) => setOptions({ statusFilter: value })}
          />
          <Separator />
          <FilterByAccountType
            value={options.accountTypeFilter}
            onChange={(value) => setOptions({ accountTypeFilter: value })}
          />
          <Separator />
          <div>
            <Label>Filter by role</Label>
            <FilterByRoleFilterMode
              value={options.roleFilterMode}
              onChange={(value) => setOptions({ roleFilterMode: value })}
            />
            <FilterByRole
              value={options.roles}
              onChange={(value) => setOptions({ roles: value })}
            />
          </div>
          <Separator />
          <FilterPlayingGame
            value={options.playing}
            onChange={(value) => setOptions({ playing: value })}
          />
          <Separator />
          <FilterByConnectedTo
            value={options.connectedTo}
            onChange={(value) => setOptions({ connectedTo: value })}
          />
        </>
      )}
    </div>
  );
}
