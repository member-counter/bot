const prefix = process.env.DISCORD_PREFIX;
const owners = process.env.BOT_OWNERS.split(/,\s?/);
const GuildModel = require('../../mongooseModels/GuildModel');
const updateCounter = require('../utils/updateCounter');

const command = {
    name: "setDigit",
    commands: [prefix+"setDigit"],
    indexZero: true,
    enabled: true,
    run: (client, message, language) => {
        if (message.member.hasPermission('ADMINISTRATOR') || owners.includes(message.member.id)) {
            const args = message.content.split(" ");
            if (args.length === 3) {
                const digitToUpdate = args[1].slice(0, 1);
                const newDigitValue = args[2];
                GuildModel.findOne({guild_id:message.guild.id})
                .then((guild_settings) => {
                    guild_settings.custom_numbers[digitToUpdate] = newDigitValue
                    guild_settings.save()
                    .then(() => {
                        message.channel.send(language.commands.setDigit.success).catch(console.error);
                        updateCounter(client, message.guild.id);
                    })
                })
                .catch(() => {
                    message.channel.send(language.commands.setDigit.error_unknown).catch(console.error)
                })
            } else {
                message.channel.send(language.commands.setDigit.error_missing_params).catch(console.error)
            }
        } else {
            message.channel.send(language.commands.setDigit.error_no_admin).catch(console.error)
        }
    }
}

module.exports = command;