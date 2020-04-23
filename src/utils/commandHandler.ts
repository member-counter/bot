import getEnv from './getEnv';
import Eris from 'eris';
import GuildService from '../services/GuildService';
import { loadLanguagePack } from './languagePack';
import MemberCounterCommand from '../typings/MemberCounterCommand';
import memberHasAdminPermission from './memberHasAdminPermission';
import UserError from './UserError';

const {
  PREMIUM_BOT,
  DISCORD_PREFIX,
  DISCORD_DEFAULT_LANG,
  DISCORD_OFFICIAL_SERVER_ID,
} = getEnv();

// Commands
import statusCommands from '../commands/status';
import patpatCommands from '../commands/patpat';
import userCommands from '../commands/user';
import infoCommands from '../commands/info';
import helpCommands from '../commands/help';
import donateCommands from '../commands/donate';
import settingsCommands from '../commands/settings';
import countCommands from '../commands/counts';

const commands: Array<MemberCounterCommand> = [
  ...userCommands,
  ...statusCommands,
  ...patpatCommands,
  ...infoCommands,
  ...helpCommands,
  ...donateCommands,
  ...settingsCommands,
  ...countCommands,
];

export default async (client: Eris.Client, message: Eris.Message) => {
  const { channel, author, content } = message;

  // Ignore requested commands in the official server since this server already has the premium bot
  if (
    channel instanceof Eris.GuildChannel &&
    !PREMIUM_BOT &&
    channel.guild &&
    channel.guild.id === DISCORD_OFFICIAL_SERVER_ID
  ) {
    return;
  }

  // Avoid responding to other bots
  if (author && !author.bot) {
    let prefix: string;
    let languagePack;

    if (channel instanceof Eris.GuildChannel) {
      const guildSettings = new GuildService(channel.guild.id);
      await guildSettings.init();

      languagePack = loadLanguagePack(guildSettings.language);
      prefix = guildSettings.prefix;
    } else {
      languagePack = loadLanguagePack(DISCORD_DEFAULT_LANG);
      prefix = DISCORD_PREFIX;
    }

    prefix = prefix.toLowerCase();

    const commandRequested = content.toLowerCase(); // Case insensitive match

    if (commandRequested.startsWith(prefix)) {
      commandsLoop: for (const command of commands) {
        for (const alias of command.aliases) {
          let commandAliasToCheck = prefix + alias.toLowerCase();

          if (commandRequested.startsWith(commandAliasToCheck)) {
            if (channel instanceof Eris.PrivateChannel && command.denyDm) {
              channel
                .createMessage(languagePack.functions.commandHandler.noDm)
                .catch(console.error);
              break commandsLoop;
            }

            if (
              channel instanceof Eris.GuildChannel &&
              command.onlyAdmin &&
              !(await memberHasAdminPermission(message.member))
            ) {
              channel
                .createMessage(languagePack.common.errorNoAdmin)
                .catch(console.error);
              break commandsLoop;
            }

            try {
              command.run({
                message,
                languagePack,
              });
            } catch (error) {
              if (error instanceof UserError)
                channel.createMessage(error.message).catch(console.error);
              else console.error(error);
            }
            break commandsLoop;
          }
        }
      }
    }
  }
};
