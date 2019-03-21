const prefix = process.env.prefix || require('../../bot-config.json').prefix;
const { log, error } = require('../utils/customConsole');
const GuildModel = require('../../mongooseModels/GuildModel');
const updateCounter = require('../utils/updateCounter');

const command = {
    name: "enable",
    commands: [prefix+"enable"],
    indexZero: true, 
    enabled: true,
    run: (client, message, language) => {
        if (message.member.hasPermission('ADMINISTRATOR')) {
            GuildModel.findOneAndUpdate({guild_id:message.guild.id}, {guild_id:message.guild.id, channel_id: message.channel.id}, {upsert: true})
            .then(()=>{
                message.channel.send(language.command.enable.success).catch(error);
                updateCounter(client, message.guild.id)
            })
            .catch((e)=>{
                error(e);
                message.channel.send(language.command.enable.error_unknown).catch(error)
            });
        } else {
            message.channel.send(language.command.enable.error_no_admin).catch(error)
        }
    }
}

module.exports = command;