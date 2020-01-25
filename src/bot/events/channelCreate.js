const updateCounter = require("../utils/updateCounter");

module.exports = (client, channel) => {
    if (channel.guild) {
        if (channel.type !== 4) client.guildsCounts.get(channel.guild.id).increment("channels", 1);
        updateCounter({client, guildSettings: channel.guild.id});
    }
}