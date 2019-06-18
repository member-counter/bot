const prefix = process.env.prefix || require('../../bot-config.json').prefix;
const { log, error } = require('../utils/customConsole');
const GuildModel = require('../../mongooseModels/GuildModel');

const command = {
    name: "disable",
    commands: [prefix+"disable"],
    indexZero: true, 
    enabled: true,
    run: (client, message, language) => {
        if (message.member.hasPermission('ADMINISTRATOR')) {
            GuildModel.findOneAndUpdate({guild_id:message.guild.id}, {guild_id:message.guild.id}, {upsert: true})
            .then((result)=>{
                result.channel_id = result.channel_id.filter(element => element !== message.channel.id);
                result.save().then(()=>{
                    client.channels.get(message.channel.id).setTopic('').catch(error);
                    message.channel.send(language.command.disable.success).catch(error)
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