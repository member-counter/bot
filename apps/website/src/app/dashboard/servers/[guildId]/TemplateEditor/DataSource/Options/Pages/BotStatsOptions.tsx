import type { DataSourceBotStats } from "@mc/common/DataSource";
import { ServerIcon, UsersIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const [options, setOptions] = useDataSourceOptions({
    unmergedOptions,
    defaultOptionsMerger,
    onOptionsChange,
  });

  return (
    <div>
      <div>
        <Label>{t('pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.BotStatsOptions.display')}</Label>
        <Select
          value={options.return.toString()}
          onValueChange={(value) => setOptions({ return: Number(value) })}
        >
          <SelectTrigger>
            <SelectValue placeholder={t('pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.BotStatsOptions.selectPlaceholder')} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItemWithIcon
                value={BotStatsDataSourceReturn.GUILDS.toString()}
                label={t('pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.BotStatsOptions.servers')}
                icon={ServerIcon}
              />
              <SelectItemWithIcon
                value={BotStatsDataSourceReturn.USERS.toString()}
                label={t('pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.BotStatsOptions.users')}
                icon={UsersIcon}
              />
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
