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
    const guildSettings = new GuildService(channel.guild.id);
    await guildSettings.init();

    if (channel instanceof TextChannel || channel instanceof NewsChannel) {
      const { topic, id } = channel;
      if (/\{.+\}/.test(topic)) await guildSettings.setCounter(id, topic);
      else if (topic.length === 0)
        await guildSettings.deleteCounter(channel.id);
    }

    if (channel instanceof CategoryChannel || channel instanceof VoiceChannel) {
      const { name, id } = channel;
      if (/\{.+\}/.test(channel.name))
        await guildSettings.setCounter(channel.id, channel.name);
    }
  }
};

export default updateCounterContent;
