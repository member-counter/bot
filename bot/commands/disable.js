const prefix = process.env.prefix || require('../../bot-config.json').prefix;
const { log, error } = require('../utils/customConsole');
const GuildModel = require('../../mongooseModels/GuildModel')
const updateCounter = require('../utils/updateCounter')

const command = {
    name: "disable",
    commands: [prefix+"disable"],
    indexZero: true, 
    enabled: true,
    run: (client, message, language) => {
        if (message.member.hasPermission('ADMINISTRATOR')) {
            GuildModel.findOneAndUpdate({guild_id:message.guild.id}, {guild_id:message.guild.id, channel_id: '0'}, {upsert: true})
            .then((old_doc)=>{
                message.channel.send(language.command.disable.success);
                if (old_doc !== null && old_doc.channel_id !== '0') {
                    client.channels.get(old_doc.channel_id).setTopic('')
                }
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