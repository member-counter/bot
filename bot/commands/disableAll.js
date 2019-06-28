const prefix = process.env.prefix || require('../../bot-config.json').prefix;
const { log, error } = require('../utils/customConsole');
const GuildModel = require('../../mongooseModels/GuildModel');

const command = {
    name: "disableAll",
    commands: [prefix+"disableAll"],
    indexZero: true, 
    enabled: true,
    run: (client, message, language) => {
        if (message.member.hasPermission('ADMINISTRATOR')) {
            GuildModel.findOneAndUpdate({guild_id:message.guild.id}, {guild_id:message.guild.id}, {upsert: true})
            .then((result)=>{
                const channelsToReset = result.channel_id;
                result.channel_id = [];
                result.save().then(()=>{
                    message.channel.send(language.command.disableAll.success).catch(error);
                    channelsToReset.forEach(channel_id => {
                        client.channels.get(channel_id).setTopic('').catch(error)
                    });
                });
            })
            .catch((e)=>{
                error(e);
                message.channel.send(language.command.disableAll.error_unknown).catch(error)
            });
        } else {
            message.channel.send(language.command.disableAll.error_no_admin).catch(error)
        }
    }
}

module.exports = command;