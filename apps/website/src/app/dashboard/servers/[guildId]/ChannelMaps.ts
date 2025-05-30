import type { TFunction } from "i18next";
import type { LucideIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { ChannelType, PermissionFlagsBits } from "discord-api-types/v10";
import {
  BookTextIcon,
  ChevronDownIcon,
  FolderIcon,
  HashIcon,
  HelpCircleIcon,
  ImageIcon,
  LockKeyholeIcon,
  MegaphoneIcon,
  MessagesSquareIcon,
  PodcastIcon,
  Volume2Icon,
} from "lucide-react";

import { BitField } from "@mc/common/BitField";

import type { DashboardGuildParams } from "./layout";
import { api } from "~/trpc/react";

export const ChannelIconMap: Record<ChannelType | number, LucideIcon> = {
  [ChannelType.GuildText]: HashIcon,
  [ChannelType.GuildCategory]: ChevronDownIcon,
  [ChannelType.GuildVoice]: Volume2Icon,
  [ChannelType.GuildAnnouncement]: MegaphoneIcon,
  [ChannelType.GuildStageVoice]: PodcastIcon,
  [ChannelType.GuildForum]: MessagesSquareIcon,
  [ChannelType.GuildMedia]: ImageIcon,
};

export function ChannelLabelMap(
  t: TFunction,
): Record<ChannelType | number, string> {
  return {
    [ChannelType.GuildText]: t("common.channelLabels.textChannel"),
    [ChannelType.GuildCategory]: t("common.channelLabels.category"),
    [ChannelType.GuildVoice]: t("common.channelLabels.voiceChannel"),
    [ChannelType.GuildAnnouncement]: t(
      "common.channelLabels.announcementChannel",
    ),
    [ChannelType.GuildStageVoice]: t("common.channelLabels.stageChannel"),
    [ChannelType.GuildForum]: t("common.channelLabels.forumChannel"),
    [ChannelType.GuildMedia]: t("common.channelLabels.mediaChannel"),
  };
}

export function useChannelIcon(
  channelId: string,
  channelListView = false,
): LucideIcon {
  const { guildId } = useParams<DashboardGuildParams>();
  const guild = api.discord.getGuild.useQuery({ id: guildId });
  const channel = guild.data?.channels.get(channelId);

  const isRulesChannel = guild.data?.rulesChannelId === channel?.id;
  const isShowingLockpad =
    channel?.type === ChannelType.GuildVoice &&
    new BitField(channel.everyonePermissions).missing(
      PermissionFlagsBits.Connect,
    );
  const isCategory = channel?.type === ChannelType.GuildCategory;

  let icon: LucideIcon | undefined;
  if (isRulesChannel) icon = BookTextIcon;
  else if (isShowingLockpad) icon = LockKeyholeIcon;
  else if (isCategory && !channelListView) icon = FolderIcon;
  else if (channel) icon = ChannelIconMap[channel.type];
  icon ??= HelpCircleIcon;

  return icon;
}
