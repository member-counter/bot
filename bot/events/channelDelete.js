const GuildModel = require("../../mongooseModels/GuildModel");
const updateCounter = require("../utils/updateCounter");

module.exports = client => {
    client.on("channelDelete", channel => {
        let increment = (channel.type !== "category") ? { channels: -1 } : {};
        if (channel.guild) updateCounter({client, guildSettings: channel.guild.id, incrementCounters: increment});
        GuildModel.findOneAndUpdate({ guild_id: channel.guild.id }, { $unset: { ["topicCounterChannels."+channel.id]: "", ["channelNameCounters."+channel.id]: "" }})
    });
};
