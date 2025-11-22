import {
  AsteriskIcon,
  CircleDashedIcon,
  CircleIcon,
  MinusCircleIcon,
  MoonIcon,
  UsersIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { MembersFilterStatus } from "@mc/common/DataSource";
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
export function FilterByStatus({
  value,
  onChange,
}: {
  value: Type;
  onChange: (value: Type) => void;
}) {
  const { t } = useTranslation();

  return (
    <div>
      <Label>
        {t(
          "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.MembersOptions.FilterByStatus.label",
        )}
      </Label>
      <Select
        value={value.toString()}
        onValueChange={(value) => onChange(Number(value))}
      >
        <SelectTrigger>
          <SelectValue
            placeholder={t(
              "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.MembersOptions.FilterByStatus.placeholder",
            )}
          />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItemWithIcon
              value={MembersFilterStatus.ANY.toString()}
              label={t(
                "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.MembersOptions.FilterByStatus.any",
              )}
              icon={AsteriskIcon}
            />
            <SelectItemWithIcon
              value={MembersFilterStatus.ONLINE_IDLE_DND.toString()}
              label={t(
                "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.MembersOptions.FilterByStatus.onlineIdleDnd",
              )}
              icon={UsersIcon}
            />
            <SelectItemWithIcon
              value={MembersFilterStatus.ONLINE.toString()}
              label={t(
                "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.MembersOptions.FilterByStatus.online",
              )}
              icon={CircleIcon}
            />
            <SelectItemWithIcon
              value={MembersFilterStatus.IDLE.toString()}
              label={t(
                "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.MembersOptions.FilterByStatus.idle",
              )}
              icon={MoonIcon}
            />
            <SelectItemWithIcon
              value={MembersFilterStatus.DND.toString()}
              label={t(
                "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.MembersOptions.FilterByStatus.dnd",
              )}
              icon={MinusCircleIcon}
            />
            <SelectItemWithIcon
              value={MembersFilterStatus.OFFLINE.toString()}
              label={t(
                "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.MembersOptions.FilterByStatus.offline",
              )}
              icon={CircleDashedIcon}
            />
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
