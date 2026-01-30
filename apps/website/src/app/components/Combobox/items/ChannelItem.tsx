import { CheckIcon, XIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTypedParams } from "react-router-typesafe-routes";

import { routes } from "@mc/common/Routes";

import type { ComboboxProps } from "..";
import { useChannelIcon } from "~/app/dashboard/servers/[guildId]/ChannelMaps";
import { mentionColor } from "~/lib/mentionColor";
import { api } from "~/lib/trpc";
import { TinyIconButton } from "../TinyIconButton";
import invariant from "tiny-invariant";

const useChannelId = (id: string) => {
  const { guildId } = useTypedParams(routes.dashboard.servers.server);
  invariant(guildId, "Expected guildId to be defined");
  const guild = api.discord.getGuild.useQuery({ id: guildId });

  return guild.data?.channels.get(id);
};

type Props = Parameters<ComboboxProps<string>["onItemRender"]>[0] & {
  onRemove?: () => void;
};

export const ChannelItem = ({ item, isSelected, onRemove }: Props) => {
  const { t } = useTranslation();
  const channel = useChannelId(item);

  const color = mentionColor(0xffffff);
  const Icon = useChannelIcon(item);
  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex w-full overflow-auto">
        {isSelected && (
          <CheckIcon
            className="mr-2 inline-block h-5 w-5"
            aria-label={t("components.Combobox.items.ChannelItem.selected")}
          />
        )}
        <div
          className="mr-auto overflow-hidden text-ellipsis whitespace-nowrap text-sm"
          style={{
            color: color.text,
          }}
        >
          <Icon className="mr-2 inline-block h-4 w-4" />
          {channel?.name ?? t("common.unknownChannel")}
        </div>
      </div>
      {onRemove && (
        <TinyIconButton
          icon={XIcon}
          onClick={onRemove}
          aria-label={t("components.Combobox.items.ChannelItem.removeChannel")}
        />
      )}
    </div>
  );
};
