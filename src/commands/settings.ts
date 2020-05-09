import MemberCounterCommand from '../typings/MemberCounterCommand';
import Eris, {
  GuildChannel,
  VoiceChannel,
  Channel,
  CategoryChannel,
  TextChannel,
  NewsChannel,
  Guild,
} from 'eris';
import GuildService from '../services/GuildService';
import {
  loadLanguagePack,
  availableLanguagePacks,
} from '../utils/languagePack';
import botHasPermsToEdit from '../utils/botHasPermsToEdit';
import UserError from '../utils/UserError';
import messageReactionAdd from '../events/messageReactionAdd';
import getEnv from '../utils/getEnv';

const { DISCORD_PREFIX, PREMIUM_BOT_INVITE } = getEnv();

// TODO
const seeSettings: MemberCounterCommand = {
  aliases: ['seeSettings'],
  denyDm: true,
  onlyAdmin: false,
  run: async ({ message, languagePack }) => {
    const { channel } = message;

    if (channel instanceof GuildChannel) {
      const { guild } = channel;
      const {
        headerText,
        prefixText,
        langText,
        premiumText,
        premiumNoTierText,
        premiumConfirmedText,
        allowedRolesText,
        countersText,
        customNumbersText,
        warningNoPermsText,
      } = languagePack.commands.seeSettings.settingsMessage;

      const guildSettings = await GuildService.init(guild.id);

      const {
        prefix,
        premium,
        language,
        allowedRoles,
        counters,
        digits,
      } = guildSettings;
      let guildHasWarning: boolean = false;
      const messagesToSend: string[] = [''];
      const appendContent = (content: string) => {
        const lastMessagePart = messagesToSend[messagesToSend.length - 1];
        if ((lastMessagePart + content).length > 2000) {
          messagesToSend.push(content);
        } else {
          messagesToSend[messagesToSend.length - 1] += content;
        }
      };

      // Build Message
      appendContent(`**${headerText}** ${guild.name} \`${guild.id}\`\n`);
      appendContent(
        `${premiumText} ${
          premium ? premiumConfirmedText : premiumNoTierText
        }\n`,
      );
      appendContent(`${prefixText} \`${prefix}\`\n`);
      appendContent(`${langText} \`${language}\`\n`);

      appendContent(
        `\n${allowedRolesText} ${allowedRoles
          .map((role) => `<@&${role}>`)
          .join(' ')}`,
      );

      appendContent(`\n\n${countersText}\n`);
      for (const [counter, content] of counters) {
        const discordChannel = guild.channels.get(counter);
        const { name, type } = discordChannel;
        const icon = ['\\#️⃣', ' ', '\\🔊', ' ', '\\📚', '\\📢', ' '];
        appendContent(
          `${botHasPermsToEdit(discordChannel) ? '     ' : ' \\⚠️ '}- ${
            icon[type]
          } ${name} \`${counter}\`: \`\`\`${content}\`\`\`\n`,
        );
      }
      appendContent(`\n${customNumbersText}`);
      appendContent(` ${digits.join(' ')}\n`);

      // If there is some counter with lack of perms, show the legend
      if (
        Array.from(counters).filter(([channelId]) => {
          const discordChannel = guild.channels.get(channelId);
          return !botHasPermsToEdit(discordChannel);
        }).length > 0
      ) {
        appendContent(`\n${warningNoPermsText}`);
      }

      for (const message of messagesToSend) {
        await channel.createMessage(message);
      }
    }
  },
};

const resetSettings: MemberCounterCommand = {
  aliases: ['resetSettings', 'restoreSettings'],
  denyDm: true,
  onlyAdmin: true,
  run: async ({ message, languagePack }) => {
    if (message.channel instanceof GuildChannel) {
      const { channel, author } = message;
      const { guild } = channel;

      const guildSettings = await GuildService.init(guild.id);

      guildSettings.counters.forEach((content, channelId) => {
        if (guild.channels.has(channelId)) {
          const channel = guild.channels.get(channelId);
          if (
            channel instanceof VoiceChannel ||
            channel instanceof CategoryChannel
          ) {
            channel
              .delete(`Reset requested by <@${author.id}>`)
              .catch(console.error);
          }
          if (
            channel instanceof TextChannel ||
            channel instanceof NewsChannel
          ) {
            channel
              .edit({ topic: '' }, `Reset requested by <@${author.id}>`)
              .catch(console.error);
          }
        }
      });

      await guildSettings.resetSettings();
      await channel.createMessage(languagePack.commands.resetSettings.done);
    }
  },
};

const lang: MemberCounterCommand = {
  aliases: ['lang', 'language'],
  denyDm: true,
  onlyAdmin: true,
  run: async ({ message, languagePack }) => {
    if (message.channel instanceof GuildChannel) {
      const { content, channel } = message;
      const { guild } = channel;
      const availableLanguages = availableLanguagePacks;
      const [command, languageRequested]: any[] = content.split(/\s+/);
      let { errorNotFound } = languagePack.commands.lang;

      if (availableLanguages.includes(languageRequested)) {
        const guildSettings = await GuildService.init(guild.id);

        await guildSettings.setLanguage(languageRequested);

        languagePack = loadLanguagePack(languageRequested);
        let { success } = languagePack.commands.lang;
        await channel.createMessage(success);
      } else {
        errorNotFound += '\n```fix\n';
        availableLanguages.forEach((availableLanguageCode) => {
          const languagePack = loadLanguagePack(availableLanguageCode);
          errorNotFound +=
            availableLanguageCode + ' ➡ ' + languagePack.langName + '\n';
        });
        errorNotFound += '```';
        await channel.createMessage(errorNotFound);
      }
    }
  },
};

const prefix: MemberCounterCommand = {
  aliases: ['prefix'],
  denyDm: true,
  onlyAdmin: true,
  run: async ({ message, languagePack }) => {
    const { channel, content } = message;
    const [command, newPrefix] = content.split(/\s+/g);

    if (channel instanceof GuildChannel) {
      const guildSettings = await GuildService.init(channel.guild.id);

      if (newPrefix) {
        await guildSettings.setPrefix(newPrefix);
        await channel.createMessage(
          languagePack.commands.prefix.success.replace(
            '{NEW_PREFIX}',
            guildSettings.prefix,
          ),
        );
      } else {
        throw new UserError(languagePack.commands.prefix.noPrefixProvided);
      }
    }
  },
};

const role: MemberCounterCommand = {
  aliases: ['role', 'roles'],
  denyDm: true,
  onlyAdmin: true,
  run: async ({ message, languagePack }) => {
    const { channel, content, roleMentions } = message;

    if (channel instanceof GuildChannel) {
      const { guild } = channel;
      const [command, action] = content.toLowerCase().split(/\s+/);
      const guildSettings = await GuildService.init(guild.id);

      let rolesMentioned: string[] = roleMentions;
      let newAllowedRoles: string[] = guildSettings.allowedRoles;

      switch (action) {
        case 'allow':
          if (/all(\s|$)/g.test(content)) {
            // that filter is to remove @everyone
            newAllowedRoles = Array.from(guild.roles, (role) =>
              role[0].toString(),
            );
            newAllowedRoles = newAllowedRoles.filter(
              (role) => role !== guild.id,
            );
          } else {
            roleMentions.forEach((role) => {
              if (!newAllowedRoles.includes(role)) newAllowedRoles.push(role);
            });
          }
          break;

        case 'deny':
          if (/all(\s|$)/g.test(content)) {
            newAllowedRoles = [];
          } else {
            roleMentions.forEach((role) => {
              newAllowedRoles = newAllowedRoles.filter(
                (allowedRole) => role !== allowedRole,
              );
            });
          }
          break;

        default:
          throw new UserError(
            languagePack.commands.role.invalidParams.replace(
              /\{PREFIX\}/gi,
              guildSettings.prefix,
            ),
          );
          return;
      }

      // save config
      if (newAllowedRoles.length > 0 || /all(\s|$)/g.test(content)) {
        await guildSettings.setAllowedRoles(newAllowedRoles);
        await channel.createMessage(languagePack.commands.role.rolesUpdated);
      } else {
        throw new UserError(languagePack.commands.role.errorNoRolesToUpdate);
      }
    }
  },
};

const upgradeServer: MemberCounterCommand = {
  aliases: ['upgradeServer', 'serverupgrade'],
  denyDm: true,
  onlyAdmin: false,
  run: async ({ message, languagePack }) => {
    const { author, channel } = message;
    const {
      success,
      noServerUpgradesAvailable,
      errorCannotUpgrade,
    } = languagePack.commands.upgradeServer;

    if (channel instanceof GuildChannel) {
      const { guild } = channel;
      const guildSettings = await GuildService.init(guild.id);

      const upgradeServer = await guildSettings.upgradeServer(author.id);

      switch (upgradeServer) {
        case 'success': {
          await channel.createMessage(
            success.replace('{BOT_LINK}', PREMIUM_BOT_INVITE),
          );
          break;
        }

        case 'alreadyUpgraded': {
          throw new UserError(errorCannotUpgrade);
          break;
        }
        case 'noUpgradesAvailable': {
          throw new UserError(
            noServerUpgradesAvailable.replace(
              /\{PREFIX\}/gi,
              guildSettings.prefix,
            ),
          );
          break;
        }
        default:
          break;
      }
    }
  },
};

const setDigit: MemberCounterCommand = {
  aliases: ['setDigit'],
  denyDm: true,
  onlyAdmin: true,
  run: async ({ message, languagePack }) => {
    const { channel, content } = message;
    const userWantsToReset = content.split(/\s+/)[1] === 'reset';

    if (channel instanceof GuildChannel) {
      const { guild } = channel;
      const guildSettings = await GuildService.init(guild.id);

      if (userWantsToReset) {
        await guildSettings.resetDigits();
        await channel.createMessage(
          languagePack.commands.setDigit.resetSuccess,
        );
      } else {
        const digitsToSet = (() => {
          let [command, ...args]: any = content.split(' ');
          return args
            .join(' ')
            .split(',')
            .map((set) => set.trim())
            .map((set) => (set = set.split(/\s+/)))
            .map((set) => {
              if (!isNaN(parseInt(set[0], 10)) && set[1]) {
                return {
                  digit: parseInt(set[0], 10),
                  value: set[1],
                };
              } else {
                return null;
              }
            })
            .filter((digit) => digit !== null);
        })();

        if (digitsToSet.length > 0) {
          for (const digitToSet of digitsToSet) {
            await guildSettings.setDigit(digitToSet.digit, digitToSet.value);
          }
          await channel.createMessage(languagePack.commands.setDigit.success);
        } else {
          throw new UserError(
            languagePack.commands.setDigit.errorMissingParams.replace(
              /\{PREFIX\}/gi,
              guildSettings.prefix,
            ),
          );
        }
      }
    }
  },
};

const shortNumber: MemberCounterCommand = {
  aliases: ['shortNumber', 'shortNumbers'],
  denyDm: true,
  onlyAdmin: true,
  run: async ({ message, languagePack }) => {
    const { channel, content } = message;
    const [command, action] = content.split(/\s+/);

    if (channel instanceof GuildChannel) {
      const { guild } = channel;
      const guildSettings = await GuildService.init(guild.id);

      switch (action) {
        case 'enable':
          await guildSettings.setShortNumber(true);
          break;

        case 'disable':
          await guildSettings.setShortNumber(false);
          break;

        default:
          throw new UserError(
            languagePack.commands.shortNumber.errorInvalidAction.replace(
              '{PREFIX}',
              guildSettings.prefix,
            ),
          );
          break;
      }

      await channel.createMessage(languagePack.commands.shortNumber.success);
    }
  },
};

const settingsCommands = [
  seeSettings,
  resetSettings,
  prefix,
  lang,
  role,
  upgradeServer,
  setDigit,
  shortNumber,
];

export default settingsCommands;
