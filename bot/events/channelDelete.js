const GuildModel = require("../../mongooseModels/GuildModel");
const updateCounter = require("../utils/updateCounter");
const guildCounts = require("../utils/guildCounts");

module.exports = client => {
    client.on("channelDelete", channel => {
        if (channel.type !== "category") guildCounts.get(channel.guild.id).increment("channels", -1);
        if (channel.guild) updateCounter({client, guildSettings: channel.guild.id});
        GuildModel.findOneAndUpdate({ guild_id: channel.guild.id }, { $unset: { ["topicCounterChannels."+channel.id]: "", ["channelNameCounters."+channel.id]: "" }})
    });
};
