import { CheckIcon, XIcon } from "lucide-react";

import type { ComboboxProps } from "..";
import { locales } from "~/other/locales";
import { TinyIconButton } from "../TinyIconButton";

export const renderLocaleItem: ComboboxProps["onItemRender"] = (
  item,
  isSelected,
) => {
  const localeName = locales[item] ?? item;
  const checkIcon = isSelected && (
    <CheckIcon className="mr-2 h-5 w-5" aria-label="selected" />
  );
  return (
    <>
      {checkIcon}
      {localeName}
    </>
  );
};
export const renderSelectedLocaleItem: ComboboxProps["onSelectedItemRender"] =
  ({ item, onRemoveRequest }) => {
    const localeName = locales[item] ?? item;
    return (
      <div className="flex w-full justify-between">
        {localeName}{" "}
        {onRemoveRequest && (
          <TinyIconButton icon={XIcon} onClick={onRemoveRequest} />
        )}
      </div>
    );
  };
