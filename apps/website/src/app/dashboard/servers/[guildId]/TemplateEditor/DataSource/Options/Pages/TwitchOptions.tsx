import type { DataSourceTwitch } from "@mc/common/DataSource";
import { EyeIcon, TagIcon, UserRoundPlusIcon } from "lucide-react";

import { TwitchDataSourceReturn } from "@mc/common/DataSource";
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
import { knownSearcheableDataSources } from "../../dataSourcesMetadata";
import useDataSourceOptions from "../useDataSourceOptions";
import { useTranslation } from "react-i18next";

type DataSourceType = DataSourceTwitch;

const defaultOptionsMerger = (options: DataSourceType["options"] = {}) => {
  return {
    username: options.username ?? "",
    return: options.return ?? TwitchDataSourceReturn.FOLLOWERS,
  };
};

export function TwitchOptions({
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
        <Label>{t('pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.TwitchOptions.display')}</Label>
        <Select
          value={options.return.toString()}
          onValueChange={(value) => setOptions({ return: Number(value) })}
        >
          <SelectTrigger>
            <SelectValue placeholder={t('pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.TwitchOptions.selectPlaceholder')} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItemWithIcon
                value={TwitchDataSourceReturn.FOLLOWERS.toString()}
                label={t('pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.TwitchOptions.followers')}
                icon={UserRoundPlusIcon}
              />
              <SelectItemWithIcon
                value={TwitchDataSourceReturn.VIEWERS.toString()}
                label={t('pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.TwitchOptions.viewers')}
                icon={EyeIcon}
              />
              <SelectItemWithIcon
                value={TwitchDataSourceReturn.CHANNEL_NAME.toString()}
                label={t('pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.TwitchOptions.channelName')}
                icon={TagIcon}
              />
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Separator />
      <div>
        <Label>{t('pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.TwitchOptions.username')}</Label>
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
            dataSourceConfigWarning: t('pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.TwitchOptions.usernameWarning'),
          })}
          onItemSelect={(username) => {
            setOptions({ username });
          }}
          prefillSelectedItemOnSearchOnFocus
          placeholder={t('pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.TwitchOptions.usernamePlaceholder')}
        />
      </div>
    </div>
  );
}
