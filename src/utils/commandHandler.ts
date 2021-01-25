import getEnv from './getEnv';
import Eris from 'eris';
import GuildService from '../services/GuildService';
import { loadLanguagePack } from './languagePack';
import memberHasAdminPermission from './memberHasAdminPermission';
import commandErrorHandler from './commandErrorHandler';
import commands from '../commands/all';
import Bot from '../bot';

const {
  PREMIUM_BOT,
  DISCORD_PREFIX,
  DISCORD_DEFAULT_LANG,
  DISCORD_OFFICIAL_SERVER_ID,
  GHOST_MODE,
  BOT_OWNERS,
} = getEnv();

export default async (message: Eris.Message) => {
  if (GHOST_MODE && !BOT_OWNERS.includes(message.author?.id)) return;

  const { channel, author, content } = message;
  const { client } = Bot;

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
    let prefixToCheck: string;
    let languagePack;

    if (channel instanceof Eris.GuildChannel) {
      const guildSettings = await GuildService.init(channel.guild.id);

      languagePack = loadLanguagePack(guildSettings.language);
      prefixToCheck = guildSettings.prefix;
    } else {
      languagePack = loadLanguagePack(DISCORD_DEFAULT_LANG);
      prefixToCheck = DISCORD_PREFIX;
    }
    prefixToCheck = prefixToCheck.toLowerCase();

    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefixToCheck)})\\s*`);

    const commandRequested = content.toLowerCase(); // Case insensitive match
    const matchedPrefix = commandRequested.match(prefixRegex)?.[0];
    if (matchedPrefix == null) return;

    if (commandRequested.startsWith(matchedPrefix)) {
      commandsLoop: for (const command of commands) {
        for (const alias of command.aliases) {
          let commandAliasToCheck = matchedPrefix + alias.toLowerCase();

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

              message.content = message.content.replace(prefixRegex, '');

              await command.run({
                client,
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
