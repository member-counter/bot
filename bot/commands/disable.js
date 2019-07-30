const prefix = process.env.DISCORD_PREFIX;
const owners = process.env.BOT_OWNERS.split(/,\s?/);
const GuildModel = require('../../mongooseModels/GuildModel');

const command = {
    name: "disable",
    commands: [prefix+"disable"],
    indexZero: true, 
    enabled: true,
    run: (client, message, language) => {
        if (message.member.hasPermission('ADMINISTRATOR') || owners.includes(message.member.id)) {
            GuildModel.findOneAndUpdate({guild_id:message.guild.id}, {}, {upsert: true})
            .then((result) => {
                const channelToRemove = (message.mentions.channels.size > 0 ) ? message.mentions.channels.first() : message.channel;
                result.channel_id = result.channel_id.filter(element => element !== channelToRemove.id);
                result.save().then(() => {
                    channelToRemove.setTopic('').catch(console.error);
                    message.channel.send(language.commands.disable.success.replace("{CHANNEL}", channelToRemove.toString())).catch(console.error)
                }).catch(console.error);
            })
            .catch((e) => {
                console.error(e);
                message.channel.send(language.commands.disable.error_unknown).catch(console.error)
            });
        } else {
            message.channel.send(language.commands.disable.error_no_admin).catch(console.error)
        }
    }
}

module.exports = command;