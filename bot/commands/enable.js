const prefix = process.env.DISCORD_PREFIX;
const owners = process.env.BOT_OWNERS.split(/,\s?/);
const GuildModel = require('../../mongooseModels/GuildModel');
const updateCounter = require('../utils/updateCounter');


const command = {
    name: "enable",
    commands: [prefix+"enable"],
    indexZero: true, 
    enabled: true,
    run: (client, message, language) => {
        if (message.member.hasPermission('ADMINISTRATOR') || owners.includes(message.member.id)) {
            GuildModel.findOneAndUpdate({ guild_id:message.guild.id }, {  }, {upsert: true, new: true})
            .then((result) => {
                const newChannel = (message.mentions.channels.size > 0 ) ? message.mentions.channels.first() : message.channel;
                if (!result.channel_id.includes(newChannel.id)) {
                    result.channel_id = [ ...result.channel_id, newChannel.id ];
                    result.save().then(() => {
                        message.channel.send(language.commands.enable.success.replace("{CHANNEL}", newChannel.toString())).catch(console.error);
                        updateCounter(client, message.guild.id);
                    }).catch(console.error);
                } else {
                    message.channel.send(language.commands.enable.error_already_enabled).catch(console.error);
                }
            })
            .catch((e) => {
                console.error(e);
                message.channel.send(language.commands.enable.error_unknown).catch(console.error)
            });
        } else {
            message.channel.send(language.commands.enable.error_no_admin).catch(console.error)
        }
    }
}

module.exports = command;