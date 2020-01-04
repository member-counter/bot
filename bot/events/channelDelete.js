const GuildModel = require("../../mongooseModels/GuildModel");
const updateCounter = require("../utils/updateCounter");

module.exports = client => {
    client.on("channelDelete", channel => {
        if (channel.guild) updateCounter({client, guildSettings: channel.guild.id, incrementCounters: { channels: -1 }});
        GuildModel.findOneAndUpdate({ guild_id: channel.guild.id }, { $unset: { ["topicCounterChannels."+channel.id]: "", ["channelNameCounters."+channel.id]: "" }})
    });
};
