const GuildModel = require("../../mongooseModels/GuildModel");
const updateCounter = require("../utils/updateCounter");

module.exports = client => {
    client.on("channelDelete", channel => {
        if (channel.guild) updateCounter(client, channel.guild.id, ["channels", "connectedusers"]);
        if (channel.type === "text" || channel.type === "news" || channel.type === "voice") {
            GuildModel.findOne({ guild_id: channel.guild.id })
                .then(guildSettings => {
                    if (guildSettings) {
                        if (channel.type === "text" || channel.type === "news") {
                            guildSettings.topicCounterChannels.delete(channel.id);
                            guildSettings.save().catch(console.error);
                        } else if (channel.type === "voice") {
                            guildSettings.channelNameCounters.delete(channel.id);
                            guildSettings.save().catch(console.error);
                        }
                    }
                })
                .catch(console.error);
        }
    });
};
