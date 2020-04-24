import MemberCounterCommand from '../typings/MemberCounterCommand';
import { GuildChannel, VoiceChannel } from 'eris';
import botHasPermsToEdit from '../utils/botHasPermsToEdit';
import UserError from '../utils/UserError';

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

const utilCommand = [lockChannel];

export default utilCommand;
