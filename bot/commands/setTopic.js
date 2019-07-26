const prefix = process.env.DISCORD_PREFIX;
const owners = process.env.BOT_OWNERS.split(/,\s?/);
const GuildModel = require('../../mongooseModels/GuildModel');
const updateCounter = require('../utils/updateCounter');

const command = {
    name: "setTopic",
    commands: [prefix+"setTopic"],
    indexZero: true,
    enabled: true,
    run: (client, message, language) => {
        if (message.member.hasPermission('ADMINISTRATOR') || owners.includes(message.member.id)) {
            const args = message.content.split(" ");
            if (args.length > 1) {
                const newTopic = message.content.slice((prefix+"setTopic ").length);
                GuildModel.findOneAndUpdate({guild_id:message.guild.id}, {topic: newTopic})
                .then(()=>{
                    message.channel.send(language.command.setTopic.success).catch(console.error)
                    updateCounter(client, message.guild.id);
                })
                .catch(()=>{
                    message.channel.send(language.command.setTopic.error_unknown).catch(console.error)
                })
            } else {
                message.channel.send(language.command.setTopic.error_missing_params).catch(console.error)
            }
        } else {
            message.channel.send(language.command.setTopic.error_no_admin).catch(console.error)
        }
    }
}

module.exports = command;