import type { DataSourceYoutube } from "@mc/common/DataSource";
import { EyeIcon, TagIcon, UserRoundPlusIcon, VideoIcon } from "lucide-react";

import { YouTubeDataSourceReturn } from "@mc/common/DataSource";
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

type DataSourceType = DataSourceYoutube;

const defaultOptionsMerger = (options: DataSourceType["options"] = {}) => {
  return {
    channelUrl: options.channelUrl ?? "",
    return: options.return ?? YouTubeDataSourceReturn.SUBSCRIBERS,
  };
};

export function YouTubeOptions({
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
        <Label>{t('pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.YouTubeOptions.display')}</Label>
        <Select
          value={options.return.toString()}
          onValueChange={(value) => setOptions({ return: Number(value) })}
        >
          <SelectTrigger>
            <SelectValue placeholder={t('pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.YouTubeOptions.selectPlaceholder')} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItemWithIcon
                value={YouTubeDataSourceReturn.SUBSCRIBERS.toString()}
                label={t('pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.YouTubeOptions.subscribers')}
                icon={UserRoundPlusIcon}
              />
              <SelectItemWithIcon
                value={YouTubeDataSourceReturn.VIEWS.toString()}
                label={t('pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.YouTubeOptions.views')}
                icon={EyeIcon}
              />
              <SelectItemWithIcon
                value={YouTubeDataSourceReturn.VIDEOS.toString()}
                label={t('pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.YouTubeOptions.videos')}
                icon={VideoIcon}
              />
              <SelectItemWithIcon
                value={YouTubeDataSourceReturn.CHANNEL_NAME.toString()}
                label={t('pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.YouTubeOptions.channelName')}
                icon={TagIcon}
              />
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Separator />
      <div>
        <Label>{t('pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.YouTubeOptions.channelUrl')}</Label>
        <Combobox
          items={knownSearcheableDataSources}
          allowSearchedTerm
          selectedItem={options.channelUrl}
          onItemRender={textWithDataSourceItemRendererFactory()}
          onSelectedItemRender={textWithDataSourceItemRendererFactory({
            onUpdate(channelUrl) {
              setOptions({ channelUrl });
            },
            onRemove() {
              setOptions({ channelUrl: undefined });
            },
            dataSourceConfigWarning: t('pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.YouTubeOptions.channelUrlWarning'),
          })}
          onItemSelect={(channelUrl) => {
            setOptions({ channelUrl });
          }}
          prefillSelectedItemOnSearchOnFocus
          placeholder={t('pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.YouTubeOptions.channelUrlPlaceholder')}
        />
      </div>
    </div>
  );
}
