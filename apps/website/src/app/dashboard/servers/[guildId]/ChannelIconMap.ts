import type { LucideIcon } from "lucide-react";
import { ChannelType } from "discord-api-types/v10";
import {
  ChevronDownIcon,
  HashIcon,
  ImageIcon,
  MegaphoneIcon,
  MessagesSquareIcon,
  PodcastIcon,
  Volume2Icon,
} from "lucide-react";

export const ChannelIconMap: Record<ChannelType | number, LucideIcon> = {
  [ChannelType.GuildText]: HashIcon,
  [ChannelType.GuildCategory]: ChevronDownIcon,
  [ChannelType.GuildVoice]: Volume2Icon,
  [ChannelType.GuildAnnouncement]: MegaphoneIcon,
  [ChannelType.GuildStageVoice]: PodcastIcon,
  [ChannelType.GuildForum]: MessagesSquareIcon,
  [ChannelType.GuildMedia]: ImageIcon,
};
