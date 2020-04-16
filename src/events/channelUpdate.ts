import {
  TextChannel,
  VoiceChannel,
  CategoryChannel,
  NewsChannel,
  AnyChannel,
} from 'eris';
import GuildService from '../services/GuildService';

const channelUpdate = async (channel: AnyChannel) => {
  if (
    channel instanceof TextChannel ||
    channel instanceof VoiceChannel ||
    channel instanceof CategoryChannel ||
    channel instanceof NewsChannel
  ) {
    let counterTextToUpdate = '';
    const guildSettings = new GuildService(channel.guild.id);
    await guildSettings.init();

    if (channel instanceof TextChannel || channel instanceof NewsChannel) {
      let counterTextToUpdate = channel.topic;
    }

    if (channel instanceof CategoryChannel || channel instanceof VoiceChannel) {
      let counterTextToUpdate = channel.name;
    }

    if (guildSettings.counters.has(channel.id)) {
      await guildSettings.setCounter(channel.id, counterTextToUpdate);
    }
  }
};

export default channelUpdate;
