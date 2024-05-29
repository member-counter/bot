import { CheckIcon, XIcon } from "lucide-react";

import type { ComboboxProps } from "..";
import { TinyIconButton } from "../TinyIconButton";

type Props = Parameters<ComboboxProps<string>["onItemRender"]>[0] & {
  onRemove?: () => void;
};

export const TextItem = ({ item, isSelected, onRemove }: Props) => {
  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex w-full overflow-auto">
        {isSelected && (
          <CheckIcon
            className="mr-2 inline-block h-5 w-5"
            aria-label="selected"
          />
        )}
        <span className="overflow-hidden text-ellipsis whitespace-nowrap">
          {item}
        </span>
      </div>
      {onRemove && (
        <TinyIconButton
          icon={XIcon}
          onClick={onRemove}
          aria-label={`Remove ${item}`}
        />
      )}
    </div>
  );
};
