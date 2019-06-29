const prefix = process.env.prefix || require('../../bot-config.json').prefix;
const owners = process.env.owners ? process.env.owners.split(/,\s?/) : require('../../bot-config.json').owners;
const { log, error } = require('../utils/customConsole');
const GuildModel = require('../../mongooseModels/GuildModel');

const command = {
    name: "reset",
    commands: [prefix+"reset"],
    indexZero: true, 
    enabled: true,
    run: (client, message, language) => {
        if (message.member.hasPermission('ADMINISTRATOR') || owners.includes(message.member.id)) {
            GuildModel.findOneAndRemove({ guild_id:message.guild.id })
            .then((result) => {
                if (result) {
                    result.channel_id.forEach(channel_id => {
                        client.channels.get(channel_id).setTopic('').catch(error)
                    });
                }
                message.channel.send(language.command.reset.done).catch(error);
            }).catch(e => {
                message.channel.send(language.command.reset.error_unknown).catch(error)
            })
        } else {
            message.channel.send(language.command.reset.error_no_admin).catch(error)
        }
    }
}

module.exports = command;