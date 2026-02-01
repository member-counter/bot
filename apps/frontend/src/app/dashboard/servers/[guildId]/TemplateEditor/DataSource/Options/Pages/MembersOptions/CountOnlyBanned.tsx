import { useId } from "react";
import { useTranslation } from "react-i18next";

import { Checkbox } from "@mc/ui/checkbox";
import { Label } from "@mc/ui/label";

type Type = boolean;
export function CountOnlyBanned({
  value,
  onChange,
}: {
  value: Type;
  onChange: (value: Type) => void;
}) {
  const { t } = useTranslation();
  const bannedCheckboxId = useId();

  return (
    <div>
      <div className="flex items-center gap-2">
        <Checkbox
          id={bannedCheckboxId}
          checked={value}
          onCheckedChange={(state) => onChange(Boolean(state))}
        />
        <Label htmlFor={bannedCheckboxId}>
          {t(
            "pages.dashboard.servers.TemplateEditor.DataSource.Options.Pages.MembersOptions.CountOnlyBanned.label",
          )}
        </Label>
      </div>
    </div>
  );
}
