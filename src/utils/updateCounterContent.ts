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
    const guildSettings = await GuildService.init(channel.guild.id);

    if (channel instanceof TextChannel || channel instanceof NewsChannel) {
      const { topic, id } = channel;
      if (/\{disable\}/gi.test(channel.topic)) {
        await guildSettings.deleteCounter(channel.id);
        await channel.edit({ topic: ':white_check_mark:' });
      } else if (/\{.+\}/.test(channel.topic)) {
        await guildSettings.setCounter(channel.id, channel.topic);
      }
    }

    if (channel instanceof CategoryChannel || channel instanceof VoiceChannel) {
      const { name, id } = channel;
      if (/\{disable\}/gi.test(channel.name)) {
        await guildSettings.deleteCounter(channel.id);
        await channel.edit({ name: '✔' });
      } else if (/\{.+\}/.test(channel.name)) {
        await guildSettings.setCounter(channel.id, channel.name);
      }
    }
  }
};

export default updateCounterContent;
