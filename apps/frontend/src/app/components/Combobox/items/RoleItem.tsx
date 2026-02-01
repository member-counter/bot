import { AtSignIcon, CheckIcon, XIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTypedParams } from "react-router-typesafe-routes";
import invariant from "tiny-invariant";

import { routes } from "@mc/common/Routes";

import type { ComboboxProps } from "..";
import { mentionColor } from "~/lib/mentionColor";
import { api } from "~/lib/trpc";
import { TinyIconButton } from "../TinyIconButton";

const useRoleId = (id: string) => {
  const { guildId } = useTypedParams(routes.dashboard.servers.server);
  invariant(guildId, "Expected guildId to be defined");
  const guild = api.discord.getGuild.useQuery({ id: guildId });

  return guild.data?.roles.get(id);
};

type Props = Parameters<ComboboxProps<string>["onItemRender"]>[0] & {
  onRemove?: () => void;
};

export const RoleItem = ({ item, isSelected, onRemove }: Props) => {
  const { t } = useTranslation();
  const role = useRoleId(item);

  const color = mentionColor(role?.color ?? 0xffffff);

  let name = role?.name;

  name ??= t("common.unknownRole");

  if (name === "@everyone")
    name = t("components.Combobox.items.RoleItem.everyone");

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex w-full overflow-auto">
        {isSelected && (
          <CheckIcon
            className="mr-2 inline-block h-5 w-5"
            aria-label={t("components.Combobox.items.RoleItem.selected")}
          />
        )}
        <div
          className="mr-auto overflow-hidden text-ellipsis whitespace-nowrap text-sm"
          style={{
            color: color.text,
          }}
        >
          <AtSignIcon className="mr-1 inline-block h-4 w-4" />
          {name}
        </div>
      </div>
      {onRemove && (
        <TinyIconButton
          icon={XIcon}
          onClick={onRemove}
          aria-label={t("components.Combobox.items.RoleItem.remove")}
        />
      )}
    </div>
  );
};
