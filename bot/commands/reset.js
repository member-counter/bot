const prefix = process.env.DISCORD_PREFIX;
const owners = process.env.BOT_OWNERS.split(/,\s?/);
const GuildModel = require('../../mongooseModels/GuildModel');

const command = {
    name: "reset",
    commands: [prefix+"reset"],
    allowedTypes: ["text"],
    indexZero: true, 
    enabled: true,
    run: (client, message, language) => {
        if (message.member.hasPermission('ADMINISTRATOR') || owners.includes(message.member.id)) {
            GuildModel.findOneAndRemove({ guild_id:message.guild.id })
            .then((result) => {
                if (result) {
                    result.channel_id.forEach(channel_id => {
                        client.channels.get(channel_id).setTopic('').catch(console.error)
                    });
                }
                message.channel.send(language.commands.reset.done).catch(console.error);
            }).catch(e => {
                message.channel.send(language.commands.reset.error_unknown).catch(console.error)
            })
        } else {
            message.channel.send(language.commands.reset.error_no_admin).catch(console.error)
        }
    }
}

module.exports = command;