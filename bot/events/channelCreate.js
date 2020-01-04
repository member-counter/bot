const updateCounter = require("../utils/updateCounter");

module.exports = client => {
    client.on("channelCreate", channel => {
        let increment = (channel.type !== "category") ? { channels: 1 } : {};
        if (channel.guild) updateCounter({client, guildSettings: channel.guild.id, incrementCounters: increment});
    });
};