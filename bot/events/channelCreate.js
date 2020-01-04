const updateCounter = require("../utils/updateCounter");

module.exports = client => {
    client.on("channelCreate", channel => {
        if (channel.guild) updateCounter({client, guildSettings: channel.guild.id, incrementCounters: { channels: 1 }});
    });
};