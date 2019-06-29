const prefix = process.env.prefix || require('../../bot-config.json').prefix;
const owners = process.env.owners ? process.env.owners.split(/,\s?/) : require('../../bot-config.json').owners;
const { log, error } = require('../utils/customConsole');
const GuildModel = require('../../mongooseModels/GuildModel');

const command = {
    name: "disable",
    commands: [prefix+"disable"],
    indexZero: true, 
    enabled: true,
    run: (client, message, language) => {
        if (message.member.hasPermission('ADMINISTRATOR') || owners.includes(message.member.id)) {
            GuildModel.findOneAndUpdate({guild_id:message.guild.id}, {guild_id:message.guild.id}, {upsert: true})
            .then((result)=>{
                const channelToRemove = (message.mentions.channels.size > 0 ) ? message.mentions.channels.first() : message.channel;
                result.channel_id = result.channel_id.filter(element => element !== channelToRemove.id);
                result.save().then(()=>{
                    channelToRemove.setTopic('').catch(error);
                    message.channel.send(language.command.disable.success.replace("{CHANNEL}", channelToRemove.toString())).catch(error)
                });
            })
            .catch((e)=>{
                error(e);
                message.channel.send(language.command.disable.error_unknown).catch(error)
            });
        } else {
            message.channel.send(language.command.disable.error_no_admin).catch(error)
        }
    }
}

module.exports = command;