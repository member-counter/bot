import type { GuildBasedChannel } from "discord.js";
import { ChannelType } from "discord-api-types/v10";
import { PermissionFlagsBits } from "discord.js";

const botHasPermsToEdit = (channel: GuildBasedChannel): boolean => {
  const botPermsInChannel = channel.permissionsFor(channel.client.user.id);

  if (!botPermsInChannel) return false;

  const botCanManage = botPermsInChannel.has(
    PermissionFlagsBits.ManageChannels,
  );

  const botCanSee = botPermsInChannel.has(PermissionFlagsBits.ViewChannel);

  const botCanConnect =
    channel.type === ChannelType.GuildVoice
      ? botPermsInChannel.has(PermissionFlagsBits.Connect)
      : true;

  return botCanManage && botCanSee && botCanConnect;
};

export default botHasPermsToEdit;
