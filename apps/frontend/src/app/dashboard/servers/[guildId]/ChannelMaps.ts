import type { TFunction } from "i18next";
import type { LucideIcon } from "lucide-react";
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
import { useTypedParams } from "react-router-typesafe-routes";
import invariant from "tiny-invariant";

import { BitField } from "@mc/common/BitField";
import { routes } from "@mc/common/Routes";

import { api } from "~/lib/trpc";

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

/**
 * Name to show for a channel. Discord hides the real name of a channel the bot
 * cannot view, so show a translated label for it.
 */
export function channelDisplayName(
  t: TFunction,
  channel: { name: string; obfuscated: boolean; type: ChannelType },
): string {
  if (!channel.obfuscated) return channel.name;

  return channel.type === ChannelType.GuildCategory
    ? t("common.hiddenCategory")
    : t("common.hiddenChannel");
}

export function useChannelIcon(
  channelId: string,
  channelListView = false,
): LucideIcon {
  const { guildId } = useTypedParams(routes.dashboard.servers.server);
  invariant(guildId, "Expected guildId to be defined");
  const guild = api.discord.getGuild.useQuery({ id: guildId });
  const channel = guild.data?.channels.get(channelId);

  const isRulesChannel = guild.data?.rulesChannelId === channel?.id;
  // The permissions of a hidden channel are not the real ones. Show the lock
  // because the bot cannot view the channel.
  const isShowingLockpad =
    channel?.type === ChannelType.GuildVoice &&
    (channel.obfuscated ||
      new BitField(channel.everyonePermissions).missing(
        PermissionFlagsBits.Connect,
      ));
  const isCategory = channel?.type === ChannelType.GuildCategory;

  let icon: LucideIcon | undefined;
  if (isRulesChannel) icon = BookTextIcon;
  else if (isShowingLockpad) icon = LockKeyholeIcon;
  else if (isCategory && !channelListView) icon = FolderIcon;
  else if (channel) icon = ChannelIconMap[channel.type];
  icon ??= HelpCircleIcon;

  return icon;
}
