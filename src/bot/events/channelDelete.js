const updateCounter = require("../utils/updateCounter");
const GuildModel = require('../../mongooseModels/GuildModel');  

module.exports = (bot, channel) => {
    if (channel.type !== 4) bot.guildsCounts.get(channel.guild.id).increment("channels", -1);
    if (channel.guild) updateCounter({bot, guildSettings: channel.guild.id});
    GuildModel.findOneAndUpdate({ guild_id: channel.guild.id }, { $unset: { ["topicCounterChannels."+channel.id]: "", ["channelNameCounters."+channel.id]: "" }})
}