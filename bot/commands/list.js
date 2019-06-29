const prefix = process.env.PREFIX;
const owners = process.env.BOT_OWNERS.split(/,\s?/);
const { log, error } = require('../utils/customConsole');
const GuildModel = require('../../mongooseModels/GuildModel');

const command = {
    name: "list",
    commands: [prefix+"list"],
    indexZero: true, 
    enabled: true,
    run: (client, message, language) => {
        if (message.member.hasPermission('ADMINISTRATOR') || owners.includes(message.member.id)) {
            GuildModel.findOne({ guild_id:message.guild.id })
            .then((result) => {
                if (result) {
                    if (result.channel_id.length === 0) { 
                        message.channel.send(language.command.list.no_channels).catch(error);
                    } else {
                        let msg = language.command.list.list;
                        result.channel_id.forEach((channel, i) => {
                            msg += ` <#${channel}>${(i === result.channel_id.length-1) ? '.' : ','}`; 
                        });
                        message.channel.send(msg).catch(error);   
                    }
                } else {
                    message.channel.send(language.command.list.no_channels).catch(error);
                }
            })
        } else {
            message.channel.send(language.command.list.error_no_admin).catch(error)
        }
    }
}

module.exports = command;