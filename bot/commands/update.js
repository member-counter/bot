const prefix = process.env.DISCORD_PREFIX;
const updateCounter = require('../utils/updateCounter');
const owners = process.env.BOT_OWNERS.split(/,\s?/);

const command = {
    name: "update",
    commands: [prefix+"update"],
    indexZero: true,
    enabled: true,
    run: (client, message, language) => {
        if (message.member.hasPermission('ADMINISTRATOR') || owners.includes(message.member.id)) {
            updateCounter(client, message.guild.id);
            message.channel.send(language.commands.update.success).catch(console.error);
        } else {
            message.channel.send(language.commands.update.error_no_admin).catch(console.error);
        }
    }
}

module.exports = command;