const updateCounter = require('../bot/utils/updateCounter');
const getCounts = require('../bot/utils/updateCounter/functions/getCounts');

// TODO

const counts = {
  name: 'counts',
  variants: ['counter', 'count', 'counts'],
  allowedTypes: [0],
  requiresAdmin: false,
  run: async ({ client, message, languagePack, guildSettings }) => {
    const { channel } = message;
    const counts = await getCounts(client, guildSettings);

    const embed = {
      color: 14503424,
      footer: {
        icon_url:
          'https://cdn.discordapp.com/avatars/343884247263608832/98ce0df05fc35de2510c045cb469e4f7.png?size=64',
        text: languagePack.commands.counts.authorText,
      },
      fields: [
        {
          name: languagePack.commands.counts.members,
          value: counts.members,
          inline: true,
        },
        {
          name: languagePack.commands.counts.onlineMembers,
          value: counts.onlineMembers,
          inline: true,
        },
        {
          name: languagePack.commands.counts.offlineMembers,
          value: counts.offlineMembers,
          inline: true,
        },
        {
          name: languagePack.commands.counts.bots,
          value: counts.bots,
          inline: true,
        },
        {
          name: languagePack.commands.counts.connectedUsers,
          value: counts.connectedUsers,
          inline: true,
        },
        {
          name: languagePack.commands.counts.channels,
          value: counts.channels,
          inline: true,
        },
        {
          name: languagePack.commands.counts.roles,
          value: counts.roles,
          inline: true,
        },
      ],
    };

    client.createMessage(channel.id, { embed }).catch(console.error);
  },
};

const setDigit = {
  name: 'setDigit',
  variants: ['setDigit'],
  allowedTypes: [0],
  requiresAdmin: true,
  run: ({ client, message, guildSettings, languagePack }) => {
    const { channel, content } = message;
    const args = content.split(/\s+/);

    if (args[1] === 'reset') {
      guildSettings.topicCounterCustomNumbers = {};

      guildSettings
        .save()
        .then(() => {
          client
            .createMessage(
              channel.id,
              languagePack.commands.setDigit.reset_success,
            )
            .catch(console.error);
          updateCounter({ client, guildSettings });
        })
        .catch((e) => {
          console.error(e);
          client
            .createMessage(channel.id, languagePack.common.error_db)
            .catch(console.error);
        });
    } else {
      if (args.length >= 3) {
        const digitToUpdate = args[1].slice(0, 1);
        const newDigitValue = args[2];

        guildSettings.topicCounterCustomNumbers[digitToUpdate] = newDigitValue;
        guildSettings
          .save()
          .then(() => {
            client
              .createMessage(channel.id, languagePack.commands.setDigit.success)
              .catch(console.error);
            updateCounter({ client, guildSettings });
          })
          .catch((e) => {
            console.error(e);
            client
              .createMessage(channel.id, languagePack.common.error_db)
              .catch(console.error);
          });
      } else {
        client
          .createMessage(
            channel.id,
            languagePack.commands.setDigit.error_missing_params.replace(
              /\{PREFIX\}/gi,
              guildSettings.prefix,
            ),
          )
          .catch(console.error);
      }
    }
  },
};
const countCommands = [setDigit, counts];

export default countCommands;
