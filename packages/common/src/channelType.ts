import { ChannelType } from "discord-api-types/v10";

/**
 * Channel types the bot can update (set a name or topic on). Anything else is
 * not supported, so user-facing channel configuration must gate on this.
 */
export function isBotSupportedChannel(type: ChannelType): boolean {
  return [
    ChannelType.GuildText,
    ChannelType.GuildAnnouncement,
    ChannelType.GuildVoice,
    ChannelType.GuildCategory,
  ].includes(type);
}

/**
 * Text-like channels whose template targets the channel TOPIC.
 * Every other supported channel type has its template applied to the NAME.
 */
export function isTextLikeChannel(type: ChannelType): boolean {
  return [ChannelType.GuildText, ChannelType.GuildAnnouncement].includes(type);
}

/**
 * Channel types whose names Discord forces to lowercase and hyphen-separated
 * (spaces become hyphens), so their names should be split on "-" when searching.
 */
export function channelNameIsHyphenated(type: ChannelType): boolean {
  return [
    ChannelType.GuildText,
    ChannelType.GuildAnnouncement,
    ChannelType.GuildForum,
    ChannelType.GuildMedia,
  ].includes(type);
}
