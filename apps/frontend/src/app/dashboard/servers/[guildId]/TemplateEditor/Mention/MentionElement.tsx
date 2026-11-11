import type { RenderElementProps } from "slate-react";
import { useState } from "react";
import { AtSignIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTypedParams } from "react-router-typesafe-routes";
import { useFocused, useSelected } from "slate-react";
import invariant from "tiny-invariant";

import { routes } from "@mc/common/Routes";

import type { MentionElement as MentionElementType } from "../custom-types";
import type { GuildChannel, GuildRole } from "../d-types";
import { mentionColor } from "~/lib/mentionColor";
import { api } from "~/lib/trpc";
import { channelDisplayName, useChannelIcon } from "../../ChannelMaps";

export const MentionElement = (props: RenderElementProps) => {
  const { guildId } = useTypedParams(routes.dashboard.servers.server);
  invariant(guildId, "Expected guildId to be defined");
  const { t } = useTranslation();
  const element = props.element as MentionElementType;
  const { channels, roles } = api.discord.getGuild.useQuery({ id: guildId })
    .data ?? {
    channels: new Map<string, GuildChannel>(),
    roles: new Map<string, GuildRole>(),
  };

  const selected = useSelected();
  const focused = useFocused();
  const [hovered, setHovered] = useState(false);

  const isRole = "role" in element;
  const ChannelIcon = useChannelIcon(isRole ? "" : element.channel);
  const Icon = isRole ? AtSignIcon : ChannelIcon;

  let name = "Unknown";
  let computedMentionColors = mentionColor(0x9d9eff);

  if (isRole) {
    const role = roles.get(element.role);
    name = role?.name ?? t("common.unknownRole");

    if (role?.color) {
      computedMentionColors = mentionColor(role.color);
    }
  } else {
    const channel = channels.get(element.channel);
    name = channel
      ? channelDisplayName(t, channel)
      : t("common.unknownChannel");
  }

  const style: React.CSSProperties = {
    color: computedMentionColors.text,
    backgroundColor:
      hovered || (selected && focused)
        ? computedMentionColors.backgroundHover
        : computedMentionColors.background,
  };

  if (element.children[0].bold) {
    style.fontWeight = "bold";
  }
  if (element.children[0].italic) {
    style.fontStyle = "italic";
  }
  if (element.children[0].underline) {
    style.textDecoration = "underline";
  }
  if (element.children[0].strike) {
    style.textDecoration = "line-through";
  }

  return (
    <span
      {...props.attributes}
      contentEditable={false}
      className="m-0 rounded-md px-[4px] py-[2px] align-baseline"
      style={style}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Icon className="relative top-[-1px] mr-1 inline-block h-4 w-4" />
      {name}
      {props.children}
    </span>
  );
};
