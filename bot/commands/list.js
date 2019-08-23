const prefix = process.env.DISCORD_PREFIX;
const owners = process.env.BOT_OWNERS.split(/,\s?/);
const GuildModel = require('../../mongooseModels/GuildModel');

const command = {
    name: "list",
    commands: [prefix+"list"],
    allowedTypes: ["text"],
    indexZero: true, 
    enabled: true,
    run: (client, message, language) => {
        if (message.member.hasPermission('ADMINISTRATOR') || owners.includes(message.member.id)) {
            GuildModel.findOne({ guild_id:message.guild.id })
            .then((result) => {
                if (result) {
                    if (result.channel_id.length === 0) { 
                        message.channel.send(language.commands.list.no_channels).catch(console.error);
                    } else {
                        let msg = language.commands.list.list;
                        result.channel_id.forEach((channel, i) => {
                            msg += ` <#${channel}>${(i === result.channel_id.length-1) ? '.' : ','}`; 
                        });
                        message.channel.send(msg).catch(console.error);   
                    }
                } else {
                    message.channel.send(language.commands.list.no_channels).catch(console.error);
                }
            })
        } else {
            message.channel.send(language.commands.list.error_no_admin).catch(console.error)
        }
    }
}

module.exports = command;