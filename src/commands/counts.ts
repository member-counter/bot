import MemberCounterCommand from '../typings/MemberCounterCommand';
import embedBase from '../utils/embedBase';
import CountService from '../services/CountService';
import Eris from 'eris';

const counts: MemberCounterCommand = {
  aliases: ['counter', 'count', 'counts'],
  denyDm: true,
  onlyAdmin: false,
  run: async ({ message, languagePack }) => {
    const { channel } = message;
    if (channel instanceof Eris.GuildChannel) {
      const { guild } = channel;
      const counts = await CountService.init(guild);

      const embed = embedBase({
        fields: [
          {
            name: languagePack.commands.counts.members,
            value: await counts.processCounter('members'),
            inline: true,
          },
          {
            name: languagePack.commands.counts.onlineMembers,
            value: await counts.processCounter('onlinemembers'),
            inline: true,
          },
          {
            name: languagePack.commands.counts.offlineMembers,
            value: await counts.processCounter('offlinemembers'),
            inline: true,
          },
          {
            name: languagePack.commands.counts.bots,
            value: await counts.processCounter('bots'),
            inline: true,
          },
          {
            name: languagePack.commands.counts.connectedUsers,
            value: await counts.processCounter('connectedmembers'),
            inline: true,
          },
          {
            name: languagePack.commands.counts.channels,
            value: await counts.processCounter('channels'),
            inline: true,
          },
          {
            name: languagePack.commands.counts.roles,
            value: await counts.processCounter('roles'),
            inline: true,
          },
        ],
      });

      channel.createMessage({ embed });
    }
  },
};

const countCommands = [counts];

export default countCommands;
