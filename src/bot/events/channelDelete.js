const updateCounter = require("../utils/updateCounter");
const GuildModel = require('../../mongooseModels/GuildModel');  

module.exports = (client, channel) => {
    if (channel.guild) updateCounter({client, guildSettings: channel.guild.id});
    GuildModel.findOneAndUpdate({ guild_id: channel.guild.id }, { $unset: { ["topicCounterChannels."+channel.id]: "", ["channelNameCounters."+channel.id]: "" }})
}