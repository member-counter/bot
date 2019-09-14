const GuildModel = require("../../mongooseModels/GuildModel");

module.exports = client => {
    client.on("channelDelete", channel => {
        if (channel.type === "text" || channel.type === "news" || channel.type === "voice") {
            GuildModel.findOne({ guild_id: channel.guild.id })
                .then(guild_settings => {
                    if (guild_settings) {
                        if (channel.type === "text" || channel.type === "news") {
                            guild_settings.enabled_channels = guild_settings.enabled_channels.filter(channel_id => channel_id !== channel.id);
                            guild_settings.save().catch(console.error);
                        } else if (channel.type === "voice") {
                            guild_settings.channelNameCounter.delete(channel.id);
                            guild_settings.save().catch(console.error);
                        }
                    }
                })
                .catch(console.error);
        }
    });
};
