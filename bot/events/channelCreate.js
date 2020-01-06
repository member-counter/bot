const updateCounter = require("../utils/updateCounter");
const guildCounts = require("../utils/guildCounts");

module.exports = client => {
    client.on("channelCreate", channel => {
        if (channel.guild) {
            if (channel.type !== "category") guildCounts.get(channel.guild.id).increment("channels", 1);
            updateCounter({client, guildSettings: channel.guild.id});
        }
    });
};