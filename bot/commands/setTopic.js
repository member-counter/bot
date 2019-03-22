const prefix = process.env.prefix || require('../../bot-config.json').prefix;
const { log, error } = require('../utils/customConsole');
const GuildModel = require('../../mongooseModels/GuildModel');
const updateCounter = require('../utils/updateCounter');

const command = {
    name: "setTopic",
    commands: [prefix+"setTopic"],
    indexZero: true,
    enabled: true,
    run: (client, message, language) => {
        if (message.member.hasPermission('ADMINISTRATOR')) {
            const args = message.content.split(" ");
            if (args.length > 1) {
                const newTopic = message.content.slice((prefix+"setTopic ").length);
                GuildModel.findOneAndUpdate({guild_id:message.guild.id}, {topic: newTopic})
                .then(()=>{
                    message.channel.send(language.command.setTopic.success).catch(error)
                    updateCounter(client, message.guild.id);
                })
                .catch(()=>{
                    message.channel.send(language.command.setTopic.error_unknown).catch(error)
                })
            } else {
                message.channel.send(language.command.setTopic.error_missing_params).catch(error)
            }
        } else {
            message.channel.send(language.command.setTopic.error_no_admin).catch(error)
        }
    }
}

module.exports = command;