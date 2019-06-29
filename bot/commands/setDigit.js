const prefix = process.env.PREFIX;
const owners = process.env.BOT_OWNERS.split(/,\s?/);
const { log, error } = require('../utils/customConsole');
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
                console.log(1)
                const digitToUpdate = args[1].slice(0, 1);
                const newDigitValue = args[2];
                const newData = {custom_numbers: {}}
                newData.custom_numbers[digitToUpdate] = newDigitValue;
                GuildModel.findOneAndUpdate({guild_id:message.guild.id}, newData)
                .then(()=>{
                    message.channel.send(language.command.setDigit.success).catch(error)
                    updateCounter(client, message.guild.id);
                })
                .catch(()=>{
                    message.channel.send(language.command.setDigit.error_unknown).catch(error)
                })
            } else {
                message.channel.send(language.command.setDigit.error_missing_params).catch(error)
            }
        } else {
            message.channel.send(language.command.setDigit.error_no_admin).catch(error)
        }
    }
}

module.exports = command;