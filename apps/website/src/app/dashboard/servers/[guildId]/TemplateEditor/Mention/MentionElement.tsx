import type { RenderElementProps } from "slate-react";
import { useState } from "react";
import { useParams } from "next/navigation";
import { HashIcon } from "lucide-react";
import { useFocused, useSelected } from "slate-react";

import type { DashboardGuildParams } from "../../layout";
import type { MentionElement as MentionElementType } from "../custom-types";
import type { GuildChannel, GuildRole } from "../d-types";
import { mentionColor } from "~/other/mentionColor";
import { api } from "~/trpc/react";

export const MentionElement = (props: RenderElementProps) => {
  const { guildId } = useParams<DashboardGuildParams>();
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

  let name = "";
  let textColor = "#c0c4f2";
  let backgroundColor = "#3c4270";
  let hoverBackgroundColor = "#5865f2";

  if (isRole) {
    const role = roles.get(element.role);
    name = "Unknown role";

    if (role) {
      name = role.name;
      const { background, backgroundHover, text } = mentionColor(role.color);
      textColor = text;
      backgroundColor = background;
      hoverBackgroundColor = backgroundHover;
    }
  } else {
    const channel = channels.get(element.channel);
    name = channel?.name ?? "Unknown channel";
  }

  const style: React.CSSProperties = {
    color: textColor,
    backgroundColor:
      hovered || (selected && focused) ? hoverBackgroundColor : backgroundColor,
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
      {isRole ? (
        "@"
      ) : (
        <HashIcon className="relative top-[-1px] mr-[2px] inline-block h-4 w-4" />
      )}
      {name}
      {props.children}
    </span>
  );
};
