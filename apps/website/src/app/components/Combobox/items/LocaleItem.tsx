import { CheckIcon, XIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { ComboboxProps } from "..";
import { locales } from "~/other/locales";
import { TinyIconButton } from "../TinyIconButton";

type Props = Parameters<ComboboxProps<string>["onItemRender"]>[0] & {
  onRemove?: () => void;
};

export const LocaleItem = ({ item, isSelected, onRemove }: Props) => {
  const { t } = useTranslation();
  const localeName = locales[item] ?? item;

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex w-full overflow-auto">
        {isSelected && (
          <CheckIcon
            className="mr-2 inline-block h-5 w-5"
            aria-label={t("components.Combobox.items.LocaleItem.selected")}
          />
        )}

        <span className="overflow-hidden text-ellipsis whitespace-nowrap">
          {localeName}
        </span>
      </div>
      {onRemove && (
        <TinyIconButton
          icon={XIcon}
          onClick={onRemove}
          aria-label={t("components.Combobox.items.LocaleItem.remove")}
        />
      )}
    </div>
  );
};
