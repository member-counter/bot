import type { DataSource, DataSourceMembers } from "@mc/common/DataSource";
import { useCallback, useId, useMemo } from "react";
import { useParams } from "next/navigation";
import {
  AsteriskIcon,
  BlendIcon,
  BotIcon,
  CircleDashedIcon,
  CircleIcon,
  MinusCircleIcon,
  MoonIcon,
  UserIcon,
} from "lucide-react";

import {
  FilterMode,
  MembersFilterAccountType,
  MembersFilterStatus,
} from "@mc/common/DataSource";
import { Checkbox } from "@mc/ui/checkbox";
import { Input } from "@mc/ui/input";
import { Label } from "@mc/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@mc/ui/select";
import { SelectItemWithIcon } from "@mc/ui/selectItemWithIcon";
import { Separator } from "@mc/ui/separator";

import type { Searchable } from "../../../../../../../components/AutocompleteInput";
import type { DashboardGuildParams } from "../../../../layout";
import type { GuildRole } from "../../../d-types";
import type { SetupOptionsInterface } from "../SetupOptionsInterface";
import { Combobox } from "~/app/components/Combobox";
import { DataSourceItem } from "~/app/components/Combobox/items/DataSourceItem";
import { TextItem } from "~/app/components/Combobox/items/TextItem";
import { textWithDataSourceItemRendererFactory } from "~/app/components/Combobox/renderers/textWithDataSourceItem";
import { addTo, removeFrom, updateIn } from "~/other/array";
import { api } from "~/trpc/react";
import AutocompleteInput from "../../../../../../../components/AutocompleteInput";
import {
  knownSearcheableDataSources,
  searcheableDataSources,
} from "../../dataSourcesMetadata";
import useDataSourceOptions from "../useDataSourceOptions";
import {
  AutocompleteRoleItemRenderer,
  roleItemRendererFactory,
} from "./components/itemRenderers/roles";
import {
  AutocompleteTextItemRenderer,
  textItemRendererFactory,
} from "./components/itemRenderers/text";

type DataSourceType = DataSourceMembers;

const defaultOptionsMerger = (options: DataSourceType["options"] = {}) => {
  return {
    statusFilter: options.statusFilter ?? MembersFilterStatus.ANY,
    accountTypeFilter:
      options.accountTypeFilter ?? MembersFilterAccountType.ANY,
    bannedMembers: options.bannedMembers ?? false,
    playing: options.playing ?? [],
    roles: options.roles ?? [],
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

  const { guildId } = useParams<DashboardGuildParams>();
  const guild = api.discord.getGuild.useQuery({ id: guildId });
  const roles = useMemo(
    () => guild.data?.roles ?? new Map<string, GuildRole>(),
    [guild.data?.roles],
  );

  const bannedCheckboxId = useId();

  return (
    <>
      <div className="flex flex-col gap-5">
        <div className="flex items-center space-x-2">
          <Checkbox
            id={bannedCheckboxId}
            checked={options.bannedMembers}
            onCheckedChange={(state) =>
              setOptions({ bannedMembers: Boolean(state) })
            }
          />
          <label
            htmlFor={bannedCheckboxId}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Count only banned members
          </label>
        </div>
        {!options.bannedMembers && (
          <>
            <div className="flex flex-col gap-3">
              <Label>Filter by status</Label>
              <Select
                value={options.statusFilter.toString()}
                onValueChange={(value) =>
                  setOptions({ statusFilter: Number(value) })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItemWithIcon
                      value={MembersFilterStatus.ANY.toString()}
                      label={"Any"}
                      icon={AsteriskIcon}
                    />
                    <SelectItemWithIcon
                      value={MembersFilterStatus.ONLINE.toString()}
                      label={"Online"}
                      icon={CircleIcon}
                    />
                    <SelectItemWithIcon
                      value={MembersFilterStatus.IDLE.toString()}
                      label={"Idle"}
                      icon={MoonIcon}
                    />
                    <SelectItemWithIcon
                      value={MembersFilterStatus.DND.toString()}
                      label={"Do not disturb"}
                      icon={MinusCircleIcon}
                    />

                    <SelectItemWithIcon
                      value={MembersFilterStatus.OFFLINE.toString()}
                      label={"Offline"}
                      icon={CircleDashedIcon}
                    />
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-3">
              <Label>Filter by account type</Label>
              <Select
                value={options.accountTypeFilter.toString()}
                onValueChange={(value) =>
                  setOptions({ accountTypeFilter: Number(value) })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItemWithIcon
                      value={MembersFilterAccountType.ANY.toString()}
                      label={"Any"}
                      icon={AsteriskIcon}
                    />
                    <SelectItemWithIcon
                      value={MembersFilterAccountType.USER.toString()}
                      label={"User"}
                      icon={UserIcon}
                    />
                    <SelectItemWithIcon
                      value={MembersFilterAccountType.BOT.toString()}
                      label={"Bot"}
                      icon={BotIcon}
                    />
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-3">
              <Label>Filter by role</Label>
              <Select
                value={options.roleFilterMode.toString()}
                onValueChange={(value) =>
                  setOptions({ roleFilterMode: Number(value) })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select the filter mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Filter mode</SelectLabel>
                    <SelectItemWithIcon
                      value={FilterMode.OR.toString()}
                      label={"Any match"}
                      icon={AsteriskIcon}
                    />
                    <SelectItemWithIcon
                      value={FilterMode.AND.toString()}
                      label={"Overlap"}
                      icon={BlendIcon}
                    />
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Separator className="my-1" />
              {/* {options.roles.map(
                roleItemRendererFactory({
                  remove: (index) =>
                    setOptions({ roles: removeFrom(options.roles, index) }),
                  update: (item, index) =>
                    setOptions({
                      roles: updateIn(options.roles, item, index),
                    }),
                }),
              )}
              <AutocompleteInput
                itemRenderer={AutocompleteRoleItemRenderer}
                placeholder="Add roles..."
                onAdd={(item) => {
                  setOptions({ roles: addTo(options.roles, item) });
                }}
                allowSearchedItem={false}
                suggestableItems={searcheableRolesDataSources}
              /> */}
            </div>
            <div className="flex flex-col gap-3">
              <Label>Filter by playing a game</Label>
              {options.playing.map((item, index) => (
                <Combobox
                  items={knownSearcheableDataSources}
                  allowSearchedTerm
                  placeholder=""
                  selectedItem={item}
                  onItemSelect={(item) => {
                    setOptions({
                      playing: updateIn(options.playing, item, index),
                    });
                  }}
                  onItemRender={textWithDataSourceItemRendererFactory()}
                  onSelectedItemRender={textWithDataSourceItemRendererFactory({
                    onUpdate: (item) => {
                      // TODO: on update it seems to reset the edit stack
                      setOptions({
                        playing: updateIn(options.playing, item, index),
                      });
                    },
                    onRemove: () => {
                      setOptions({
                        playing: removeFrom(options.playing, index),
                      });
                    },
                  })}
                />
              ))}
              <Combobox
                items={knownSearcheableDataSources}
                allowSearchedTerm
                placeholder="Add game..."
                onItemSelect={(item) => {
                  setOptions({
                    playing: addTo(options.playing, item),
                  });
                }}
                onItemRender={textWithDataSourceItemRendererFactory()}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
}
