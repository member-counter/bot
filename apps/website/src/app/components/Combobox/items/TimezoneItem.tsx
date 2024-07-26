import { CheckIcon, XIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { ComboboxProps } from "..";
import { timezones } from "~/other/timezones";
import { TinyIconButton } from "../TinyIconButton";

type Props = Parameters<ComboboxProps<string>["onItemRender"]>[0] & {
  onRemove?: () => void;
};

export const TimezoneItem = ({ item, isSelected, onRemove }: Props) => {
  const { t } = useTranslation();
  const timezoneName = timezones[item]?.label ?? item;

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex w-full overflow-auto">
        {isSelected && (
          <CheckIcon
            className="mr-2 inline-block h-5 w-5"
            aria-label={t("components.Combobox.items.TimezoneItem.selected")}
          />
        )}

        <span className="overflow-hidden text-ellipsis whitespace-nowrap">
          {timezoneName}
        </span>
      </div>
      {onRemove && (
        <TinyIconButton
          icon={XIcon}
          onClick={onRemove}
          aria-label={t("components.Combobox.items.TimezoneItem.remove")}
        />
      )}
    </div>
  );
};
