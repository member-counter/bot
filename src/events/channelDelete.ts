import Eris from 'eris';
import GuildService from '../services/GuildService';

const channelDelete = async (channel: Eris.AnyChannel) => {
  if (channel instanceof Eris.GuildChannel) {
    const guildSettings = new GuildService(channel.guild.id);
    await guildSettings.init();
    await guildSettings.deleteChannel(channel.id);
  }
};

export default channelDelete;
