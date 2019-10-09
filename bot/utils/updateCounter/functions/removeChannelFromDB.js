module.exports = ({ client, channelId, type, guildSettings, error }) => {
    if (error.code === 50013 || error.code === 50001) {
        console.log(
            `[Bot shard #${client.shard.id}] I tried to update ${guildSettings.guild_id}'s counter (channel: ${channelId}), but I don't have the proper permissions. Error code: ${error.code}`
        );
        switch (type) {
            case "topicCounter":
                guildSettings.enabled_channels.filter(
                    channel_id => channel_id !== channelId
                );
                break;
            case "channelNameCounter":
                guildSettings.channelNameCounter.delete(channelId);
                guildSettings.channelNameCounter_types.delete(channelId);
                break;
        }
        guildSettings
            .save()
            .then(() =>
                console.log(
                    `[Bot shard #${client.shard.id}] Channel ${channelId} removed from DB.`
                )
            )
            .catch(console.error);
    }
};
