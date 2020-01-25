const updateCounter = require("../utils/updateCounter");

module.exports = (bot, channel) => {
    if (channel.guild) {
        if (channel.type !== 4) bot.guildsCounts.get(channel.guild.id).increment("channels", 1);
        updateCounter({bot, guildSettings: channel.guild.id});
    }
}