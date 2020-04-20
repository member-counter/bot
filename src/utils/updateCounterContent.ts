import GuildService from '../services/GuildService';
import {
  GuildChannel,
  TextChannel,
  NewsChannel,
  VoiceChannel,
  CategoryChannel,
} from 'eris';

const updateCounterContent = async (channel: GuildChannel) => {
  if (
    channel instanceof TextChannel ||
    channel instanceof NewsChannel ||
    channel instanceof VoiceChannel ||
    channel instanceof CategoryChannel
  ) {
    let content = null;
    const guildSettings = new GuildService(channel.guild.id);
    await guildSettings.init();

    if (channel instanceof TextChannel || channel instanceof NewsChannel) {
      if (/\{.+\}/.test(channel.topic)) content = channel.topic;
    }

    if (channel instanceof CategoryChannel || channel instanceof VoiceChannel) {
      if (/\{.+\}/.test(channel.name)) content = channel.name;
    }

    if (content) {
      await guildSettings.setCounter(channel.id, content);
    } else {
      await guildSettings.deleteCounter(channel.id);
    }
  }
};

export default updateCounterContent;
