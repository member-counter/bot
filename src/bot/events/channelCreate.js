const updateCounter = require("../utils/updateCounter");

module.exports = (client, channel) => {
    if (channel.guild) {
        updateCounter({client, guildSettings: channel.guild.id});
    }
}