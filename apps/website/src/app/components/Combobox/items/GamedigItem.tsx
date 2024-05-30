import { CheckIcon, XIcon } from "lucide-react";

import type { ComboboxProps } from "..";
import { api } from "~/trpc/react";
import { TinyIconButton } from "../TinyIconButton";

type Props = Parameters<ComboboxProps<string>["onItemRender"]>[0] & {
  onRemove?: () => void;
};

export const GamedigItem = ({ item, isSelected, onRemove }: Props) => {
  const { data: games } = api.bot.gamedigGames.useQuery();

  const name = games?.[item]?.name ?? item;
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
          {name}
        </span>
      </div>
      {onRemove && (
        <TinyIconButton
          icon={XIcon}
          onClick={onRemove}
          aria-label="Remove game"
        />
      )}
    </div>
  );
};
