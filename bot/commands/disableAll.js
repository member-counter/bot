const prefix = process.env.DISCORD_PREFIX;
const GuildModel = require('../../mongooseModels/GuildModel');
const owners = process.env.BOT_OWNERS.split(/,\s?/);

const command = {
    name: "disableAll",
    commands: [prefix+"disableAll"],
    indexZero: true, 
    enabled: true,
    run: (client, message, language) => {
        if (message.member.hasPermission('ADMINISTRATOR') || owners.includes(message.member.id)) {
            GuildModel.findOneAndUpdate({guild_id:message.guild.id}, {channel_id: []}, {upsert: true})
            .then((result) => {
                const channelsToReset = result.channel_id;
                message.channel.send(language.commands.disableAll.success).catch(console.error);
                channelsToReset.forEach(channel_id => {
                    client.channels.get(channel_id).setTopic('').catch(console.error)
                });
            })
            .catch((e) => {
                console.error(e);
                message.channel.send(language.commands.disableAll.error_unknown).catch(console.error)
            });
        } else {
            message.channel.send(language.commands.disableAll.error_no_admin).catch(console.error)
        }
    }
}

module.exports = command;