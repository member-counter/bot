const prefix = process.env.PREFIX;
const owners = process.env.BOT_OWNERS.split(/,\s?/);
const { log, error } = require('../utils/customConsole');
const GuildModel = require('../../mongooseModels/GuildModel');
const updateCounter = require('../utils/updateCounter');


const command = {
    name: "enable",
    commands: [prefix+"enable"],
    indexZero: true, 
    enabled: true,
    run: (client, message, language) => {
        if (message.member.hasPermission('ADMINISTRATOR') || owners.includes(message.member.id)) {
            GuildModel.findOneAndUpdate({ guild_id:message.guild.id }, { guild_id:message.guild.id }, {upsert: true, new: true})
            .then((result)=>{
                const newChannel = (message.mentions.channels.size > 0 ) ? message.mentions.channels.first() : message.channel;
                if (!result.channel_id.includes(newChannel.id)) {
                    result.channel_id = [ ...result.channel_id, newChannel.id ];
                    result.save().then(()=>{
                        message.channel.send(language.command.enable.success.replace("{CHANNEL}", newChannel.toString())).catch(error);
                        updateCounter(client, message.guild.id);
                    }).catch(error);
                } else {
                    message.channel.send(language.command.enable.error_already_enabled).catch(error);
                }
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