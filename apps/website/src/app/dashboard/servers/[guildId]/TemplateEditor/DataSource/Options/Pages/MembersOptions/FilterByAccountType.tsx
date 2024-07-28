import { AsteriskIcon, BotIcon, UserIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { MembersFilterAccountType } from "@mc/common/DataSource";
import { Label } from "@mc/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from "@mc/ui/select";
import { SelectItemWithIcon } from "@mc/ui/selectItemWithIcon";

type Type = number;
export function FilterByAccountType({
  value,
  onChange,
}: {
  value: Type;
  onChange: (value: Type) => void;
}) {
  const { t } = useTranslation();
  
  return (
    <div>
      <Label>{t('pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.MembersOptions.FilterByAccountType.label')}</Label>
      <Select
        value={value.toString()}
        onValueChange={(value) => onChange(Number(value))}
      >
        <SelectTrigger>
          <SelectValue placeholder={t('pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.MembersOptions.FilterByAccountType.placeholder')} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItemWithIcon
              value={MembersFilterAccountType.ANY.toString()}
              label={t('pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.MembersOptions.FilterByAccountType.any')}
              icon={AsteriskIcon}
            />
            <SelectItemWithIcon
              value={MembersFilterAccountType.USER.toString()}
              label={t('pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.MembersOptions.FilterByAccountType.user')}
              icon={UserIcon}
            />
            <SelectItemWithIcon
              value={MembersFilterAccountType.BOT.toString()}
              label={t('pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.MembersOptions.FilterByAccountType.bot')}
              icon={BotIcon}
            />
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
