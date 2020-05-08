import MemberCounterCommand from '../typings/MemberCounterCommand';
import { GuildChannel, VoiceChannel, User } from 'eris';
import botHasPermsToEdit from '../utils/botHasPermsToEdit';
import UserError from '../utils/UserError';
import GuildService from '../services/GuildService';

const lockChannel: MemberCounterCommand = {
  aliases: ['lockChannel'],
  denyDm: true,
  onlyAdmin: true,
  run: async ({ message, languagePack }) => {
    const {
      success,
      errorInvalidChannel,
      errorNoPerms,
      errorNotFound,
    } = languagePack.commands.lockChannel;
    const { channel, content } = message;
    if (channel instanceof GuildChannel) {
      const [command, channelId] = content.split(/\s+/);
      const { guild, client } = channel;

      if (guild.channels.has(channelId)) {
        const channelToEdit = guild.channels.get(channelId);
        if (channelToEdit instanceof VoiceChannel) {
          if (botHasPermsToEdit(channelToEdit)) {
            await channelToEdit.editPermission(
              client.user.id,
              0x00100000 | 0x00000400,
              0,
              'member',
            );
            await channelToEdit.editPermission(guild.id, 0, 0x00100000, 'role');
          } else {
            throw new UserError(
              errorNoPerms.replace(/\{CHANNEL\}/gi, channelId),
            );
          }
        } else {
          throw new UserError(errorInvalidChannel);
        }
      } else {
        throw new UserError(errorNotFound);
      }

      await channel.createMessage(success);
    }
  },
};

const editChannel: MemberCounterCommand = {
  aliases: ['editChannel'],
  denyDm: true,
  onlyAdmin: true,
  run: async ({ message, languagePack }) => {
    const { channel, content } = message;

    if (channel instanceof GuildChannel) {
      const { guild, client } = channel;
      const guildSettings = await GuildService.init(guild.id);
      let [command, channelId, ...newContent]: any = content.split(/\s+/);
      newContent = newContent.join(' ');

      if (!newContent)
        throw new UserError(languagePack.commands.editChannel.errorNoContent);

      if (!guild.channels.has(channelId))
        throw new UserError(languagePack.commands.editChannel.errorNotFound);

      await guildSettings.setCounter(channelId, newContent);
      await channel.createMessage(languagePack.commands.editChannel.success);
    }
  },
};

const utilCommands = [lockChannel, editChannel];

export default utilCommands;
