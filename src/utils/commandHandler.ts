import getEnv from './getEnv';
import Eris from 'eris';
import GuildService from '../services/GuildService';
import { loadLanguagePack } from './languagePack';
import MemberCounterCommand from '../typings/MemberCounterCommand';
import memberHasAdminPermission from './memberHasAdminPermission';
import commandErrorHandler from './commandErrorHandler';

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
import utilCommands from '../commands/utils';
import guideCommand from '../commands/guide';

const commands: Array<MemberCounterCommand> = [
  ...userCommands,
  ...statusCommands,
  ...patpatCommands,
  ...infoCommands,
  ...helpCommands,
  ...donateCommands,
  ...settingsCommands,
  ...countCommands,
  ...utilCommands,
  ...guideCommand,
];

export default async (message: Eris.Message) => {
  const { channel, author, content } = message;

  // Ignore requested commands in the official server since this server already has the premium bot
  if (
    channel instanceof Eris.GuildChannel &&
    !PREMIUM_BOT &&
    channel.guild.id === DISCORD_OFFICIAL_SERVER_ID
  ) {
    return;
  }

  // Avoid responding to other bots
  if (author && !author.bot) {
    let prefix: string;
    let languagePack;

    if (channel instanceof Eris.GuildChannel) {
      const guildSettings = await GuildService.init(channel.guild.id);

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
              const guild = (channel instanceof Eris.GuildChannel) ? channel.guild : false;
              console.log(`${author.username}#${author.discriminator} (${author.id}) [${guild ? `Server: ${guild.name} (${guild.id}), ` : ``}Channel: ${channel.id}]: ${content}`);
              await command.run({
                message,
                languagePack,
              });
            } catch (error) {
              commandErrorHandler(channel, languagePack, error);
            }
            break commandsLoop;
          }
        }
      }
    }
  }
};
