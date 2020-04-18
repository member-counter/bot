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
import loadLanguagePack from '../utils/loadLanguagePack';

// TODO
const seeSettings: MemberCounterCommand = {
  aliases: ['seeSettings'],
  denyDm: true,
  onlyAdmin: false,
  run: async ({ message, languagePack }) => {
    const { channel } = message;

    channel.createMessage('Not ready yet - WIP');
    return;

    //   const { guild } = channel;
    //   const {
    //     langText,
    //     prefixText,
    //     premiumText,
    //     premiumNoTierText,
    //     premiumConfirmedText,
    //     allowedRolesText,
    //     headerText,
    //     enabledChannelNameCountersText,
    //     miscType,
    //     enabledChannelTopicCountersText,
    //     mainTopicText,
    //     customNumbersText,
    //     warningNoPermsText,
    //   } = languagePack.commands.seeSettings.settingsMessage;
    //   const {
    //     prefix,
    //     premium,
    //     lang,
    //     allowedRoles,
    //     channelNameCounters,
    //     topicCounterChannels,
    //     mainTopicCounter,
    //     topicCounterCustomNumbers,
    //   } = guildSettings;

    //   // ==Build the message==
    //   let messageToSend = '';

    //   messageToSend += `${header_text} ${guild.name} \`(${guild.id})\`\n\n`;

    //   messageToSend += `${premium_text} ${
    //     premium ? premium_confirmed_text : premium_no_tier_text
    //   }\n`;

    //   //prefix and language

    //   messageToSend += `${prefix_text} ${prefix}\n`;
    //   messageToSend += `${lang_text} \`${lang}\` \\➡ ${languagePack.lang_name}\n\n`;

    //   //Allowed roles for administrative commands
    //   if (allowedRoles.length > 0) {
    //     let allowed_roles = '';
    //     allowedRoles.forEach((role_id) => {
    //       if (guild.roles.has(role_id)) allowed_roles += ' <@&' + role_id + '>';
    //     });
    //     messageToSend += `${allowed_roles_text} ${allowed_roles}\n`;
    //   }

    //   //channel name counters:
    //   if (channelNameCounters.size > 0) {
    //     messageToSend += `${enabled_channel_name_counters_text}\n`;

    //     channelNameCounters.forEach((channelNameCounter, channelId) => {
    //       const warningCheck = !botHasPermsToEditChannel(
    //         client,
    //         guild.channels.get(channelId),
    //       )
    //         ? '\\⚠️ '
    //         : '';

    //       messageToSend += `\\• ${warningCheck}<#${channelId}> \`(${channelId})\` \\➡ ${misc_type} \`${channelNameCounter.type}\``;
    //       if (channelNameCounter.type === 'memberswithrole') {
    //         messageToSend += ' \\➡ ';
    //         channelNameCounter.otherConfig.roles.forEach((roleId) => {
    //           messageToSend += ' <@&' + roleId + '>';
    //         });
    //       }
    //       messageToSend += '\n';
    //     });

    //     messageToSend += '\n';
    //   }

    //   //channel topic counters:
    //   if (topicCounterChannels.size > 0) {
    //     messageToSend += `${enabled_channel_topic_counters_text}\n`;

    //     topicCounterChannels.forEach((topicCounterChannel, channelId) => {
    //       const warningCheck = !botHasPermsToEditChannel(
    //         client,
    //         guild.channels.get(channelId),
    //       )
    //         ? '\\⚠️ '
    //         : '';

    //       messageToSend += `\\• ${warningCheck}<#${channelId}> \`(${channelId})\` ${
    //         topicCounterChannel.topic ? `\\➡ ${topicCounterChannel.topic}` : ''
    //       }\n`;
    //     });

    //     messageToSend += '\n';
    //   }

    //   //Main topic for topic counters
    //   messageToSend += `${main_topic_text} \`\`\`${mainTopicCounter}\`\`\``;

    //   //numbers
    //   messageToSend += `\n${custom_numbers_text}\n`;

    //   Object.entries(topicCounterCustomNumbers.toObject()).forEach(
    //     (number, i) => {
    //       messageToSend += `${i} \\➡ ${number[1]}\n`;
    //     },
    //   );

    //   messageToSend += `\n${warning_no_perms_text}`;

    //   //send in various messages
    //   messageToSend.splitSlice(2000).forEach((part) => {
    //     client.createMessage(channel.id, part).catch(console.error);
    //   });
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
      const availableLanguages = ['es_ES', 'pt_BR', 'en_US'];
      const [command, languageRequested]: any[] = content.split(/\s+/);
      let { errorNotFound, success } = languagePack.commands.lang;

      if (availableLanguages.includes(languageRequested)) {
        const guildSettings = new GuildService(guild.id);
        await guildSettings.init();
        await guildSettings.setLanguage(languageRequested);
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
        channel
          .createMessage(languagePack.commands.prefix.noPrefixProvided)
          .catch(console.error);
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

    channel.createMessage('Not ready yet - WIP');
    return;

    // if (channel instanceof GuildChannel) {
    //   const { guild } = channel;
    //   const [command, action] = content.toLowerCase().split(/\s+/);
    //   const rolesToPerformAction = roleMentions;

    //   const saveConfig = () => {
    //     if (rolesToPerformAction.length > 0 || /all(\s|$)/g.test(content)) {
    //       guildSettings.save().then(() => {
    //         client
    //           .createMessage(
    //             channel.id,
    //             languagePack.commands.role.rolesUpdated,
    //           )
    //           .catch(console.error);
    //       });
    //     } else {
    //       client
    //         .createMessage(
    //           channel.id,
    //           languagePack.commands.role.error_no_roles_to_update,
    //         )
    //         .catch(console.error);
    //     }
    //   };

    //   switch (action) {
    //     case 'allow':
    //       if (/all(\s|$)/g.test(content)) {
    //         // that filter is to remove @everyone
    //         guildSettings.allowedRoles = guild.roles
    //           .keyArray()
    //           .filter((role) => role !== guild.id);
    //       } else {
    //         rolesToPerformAction.forEach((role) => {
    //           if (!guildSettings.allowedRoles.includes(role))
    //             guildSettings.allowedRoles.push(role);
    //         });
    //       }
    //       saveConfig();
    //       break;

    //     case 'deny':
    //       if (/all(\s|$)/g.test(content)) {
    //         guildSettings.allowedRoles = [];
    //       } else {
    //         guildSettings.allowedRoles = guildSettings.allowedRoles.filter(
    //           (role) => !rolesToPerformAction.includes(role),
    //         );
    //       }
    //       saveConfig();
    //       break;

    //     default:
    //       client
    //         .createMessage(
    //           channel.id,
    //           languagePack.commands.role.invalid_params.replace(
    //             /\{PREFIX\}/gi,
    //             guildSettings.prefix,
    //           ),
    //         )
    //         .catch(console.error);
    //       break;
    //   }
    // }
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

const settingsCommands = [
  // seeSettings,
  resetSettings,
  prefix,
  lang,
  role,
  upgradeServer,
];

export default settingsCommands;
