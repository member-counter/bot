const updateCounter = require("../utils/updateCounter");

module.exports = (client, channel) => {
    if (channel.guild) {
        console.log()
        // Don't update the counters if the channel was probably created by the bot,
        // because that means that the updateCounter will be called with more recent settings
        if (!channel.permissionOverwrites.has(client.user.id)) {
            updateCounter({client, guildSettings: channel.guild.id});
        }
    }
}