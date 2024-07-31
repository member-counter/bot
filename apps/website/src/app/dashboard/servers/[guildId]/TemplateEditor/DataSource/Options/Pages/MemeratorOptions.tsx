import type { DataSourceMemerator } from "@mc/common/DataSource";
import { FerrisWheelIcon, UserRoundPlusIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { MemeratorDataSourceReturn } from "@mc/common/DataSource";
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
import { useKnownSearcheableDataSource } from "../../metadata";
import useDataSourceOptions from "../useDataSourceOptions";

type DataSourceType = DataSourceMemerator;

const defaultOptionsMerger = (options: DataSourceType["options"] = {}) => {
  return {
    username: options.username ?? "",
    return: options.return ?? MemeratorDataSourceReturn.FOLLOWERS,
  };
};

export function MemeratorOptions({
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
            "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.MemeratorOptions.display",
          )}
        </Label>
        <Select
          value={options.return.toString()}
          onValueChange={(value) => setOptions({ return: Number(value) })}
        >
          <SelectTrigger>
            <SelectValue
              placeholder={t(
                "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.MemeratorOptions.selectDisplay",
              )}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItemWithIcon
                value={MemeratorDataSourceReturn.FOLLOWERS.toString()}
                label={t(
                  "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.MemeratorOptions.followers",
                )}
                icon={UserRoundPlusIcon}
              />
              <SelectItemWithIcon
                value={MemeratorDataSourceReturn.MEMES.toString()}
                label={t(
                  "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.MemeratorOptions.memes",
                )}
                icon={FerrisWheelIcon}
              />
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Separator />
      <div>
        <Label>
          {t(
            "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.MemeratorOptions.username",
          )}
        </Label>
        <Combobox
          items={knownSearcheableDataSources}
          selectedItem={options.username}
          allowSearchedTerm
          onItemRender={textWithDataSourceItemRendererFactory()}
          onSelectedItemRender={textWithDataSourceItemRendererFactory({
            onUpdate(username) {
              setOptions({ username });
            },
            onRemove() {
              setOptions({ username: undefined });
            },
            dataSourceConfigWarning: t(
              "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.MemeratorOptions.usernameWarning",
            ),
          })}
          onItemSelect={(username) => {
            setOptions({ username });
          }}
          prefillSelectedItemOnSearchOnFocus
          placeholder=""
        />
      </div>
    </div>
  );
}
