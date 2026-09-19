import { AsteriskIcon, BlendIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { FilterMode } from "@mc/common/DataSource";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@mc/ui/select";
import { SelectItemWithIcon } from "@mc/ui/selectItemWithIcon";

type Type = number;
export function FilterByRoleFilterMode({
  value,
  onChange,
}: {
  value: Type;
  onChange: (value: Type) => void;
}) {
  const { t } = useTranslation();

  return (
    <Select
      value={value.toString()}
      onValueChange={(value) => onChange(Number(value))}
    >
      <SelectTrigger>
        <SelectValue
          placeholder={t(
            "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.MembersOptions.FilterByRoleFilterMode.placeholder",
          )}
        />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>
            {t(
              "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.MembersOptions.FilterByRoleFilterMode.label",
            )}
          </SelectLabel>
          <SelectItemWithIcon
            value={FilterMode.OR.toString()}
            label={t(
              "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.MembersOptions.FilterByRoleFilterMode.anyMatch",
            )}
            icon={AsteriskIcon}
          />
          <SelectItemWithIcon
            value={FilterMode.AND.toString()}
            label={t(
              "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.MembersOptions.FilterByRoleFilterMode.overlap",
            )}
            icon={BlendIcon}
          />
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
