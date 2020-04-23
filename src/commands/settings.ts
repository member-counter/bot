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
import AvailableLanguages from '../typings/AvailableLanguages';
import {
  loadLanguagePack,
  availableLanguagePacks,
} from '../utils/languagePack';

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

      const guildSettings = new GuildService(guild.id);
      await guildSettings.init();

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
        if ((lastMessagePart + content).length > 2048) {
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
        `${allowedRolesText} ${allowedRoles
          .map((role) => `<@&${role}>`)
          .join(' ')}`,
      );

      appendContent(`\n${countersText}\n`);
      for (const [counter, content] of counters) {
        const discordChannel = guild.channels.get(counter);
        const { name, type } = discordChannel;
        const icon = ['\\#️⃣', ' ', '\\🔊', ' ', '\\📚', '\\📢', ' '];
        appendContent(` - ${icon[type]} ${name} \`${counter}\`: ${content}\n`);
      }
      appendContent(`\n${customNumbersText}`);
      appendContent(` ${digits.join(' ')}`);

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

      const guildSettings = new GuildService(guild.id);
      await guildSettings.init();

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
      channel
        .createMessage(languagePack.commands.resetSettings.done)
        .catch(console.error);
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
        const guildSettings = new GuildService(guild.id);
        await guildSettings.init();
        await guildSettings.setLanguage(languageRequested);

        languagePack = loadLanguagePack(languageRequested);
        let { success } = languagePack.commands.lang;
        channel.createMessage(success).catch(console.error);
      } else {
        errorNotFound += '\n```fix\n';
        availableLanguages.forEach((availableLanguageCode) => {
          const languagePack = loadLanguagePack(availableLanguageCode);
          errorNotFound +=
            availableLanguageCode + ' ➡ ' + languagePack.langName + '\n';
        });
        errorNotFound += '```';
        channel.createMessage(errorNotFound).catch(console.error);
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
      const guildSettings = new GuildService(channel.guild.id);
      await guildSettings.init();

      if (newPrefix) {
        await guildSettings.setPrefix(newPrefix);
        channel
          .createMessage(
            languagePack.commands.prefix.success.replace(
              '{NEW_PREFIX}',
              guildSettings.prefix,
            ),
          )
          .catch(console.error);
      } else {
        channel.createMessage(languagePack.commands.prefix.noPrefixProvided);
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
      const guildSettings = new GuildService(guild.id);
      await guildSettings.init();

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
          await channel.createMessage(
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
        await channel.createMessage(
          languagePack.commands.role.errorNoRolesToUpdate,
        );
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
      const guildSettings = new GuildService(guild.id);
      await guildSettings.init();

      const upgradeServer = await guildSettings.upgradeServer(author.id);

      switch (upgradeServer) {
        case 'success': {
          channel
            .createMessage(
              success.replace('{BOT_LINK}', process.env.PREMIUM_BOT_INVITE),
            )
            .catch(console.error);
          break;
        }

        case 'alreadyUpgraded': {
          channel.createMessage(errorCannotUpgrade).catch(console.error);
          break;
        }
        case 'noUpgradesAvailable': {
          channel
            .createMessage(
              noServerUpgradesAvailable.replace(
                /\{PREFIX\}/gi,
                guildSettings.prefix,
              ),
            )
            .catch(console.error);
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
    const args = content.split(/\s+/);

    if (channel instanceof GuildChannel) {
      const { guild } = channel;
      const guildSettings = new GuildService(guild.id);
      await guildSettings.init();

      if (args[1] === 'reset') {
        await guildSettings.resetDigits();
        channel.createMessage(languagePack.commands.setDigit.resetSuccess);
      } else {
        if (args.length >= 3) {
          const digitToUpdate = parseInt(args[1].slice(0, 1), 10);
          const newDigitValue = args[2];

          await guildSettings.setDigit(digitToUpdate, newDigitValue);

          channel.createMessage(languagePack.commands.setDigit.success);
        } else {
          channel.createMessage(
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

const settingsCommands = [
  seeSettings,
  resetSettings,
  prefix,
  lang,
  role,
  upgradeServer,
  setDigit,
];

export default settingsCommands;
