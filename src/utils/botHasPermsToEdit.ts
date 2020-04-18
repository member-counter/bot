import { GuildChannel } from 'eris';

const botHasPermsToEdit = (channel: GuildChannel): boolean => {
  const botPermsInChannel = channel.permissionsOf(channel.client.user.id);

  const botCanManage = botPermsInChannel.has('manageChannels');

  const botCanRead =
    channel.type === 0 || channel.type === 4 || channel.type === 5
      ? botPermsInChannel.has('readMessages')
      : true;

  const botCanConnect =
    channel.type === 2 ? botPermsInChannel.has('voiceConnect') : true;

  return botCanManage && botCanRead && botCanConnect;
};

export default botHasPermsToEdit;
