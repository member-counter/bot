const GuildModel = require("../../../../mongooseModels/GuildModel");

module.exports = async ({ client, channelId, type, guildSettings, error, forceRemove }) => {
    const guildId = guildSettings.guild_id;
    console.log(
        `[Bot shard #${client.shard.id}] I tried to update ${guildId}'s counter (channel: ${channelId}), but I don't have the proper permissions or it does not exists.${(error) ? "Error code:" + error.code : "" }`
    );
    //seems stupid to fetch again guildSettings but I'm trying to solve a parallel save error so creating a new instance from the scratch could fix it, if this comment lasts more than 30 days that will mean that I fixed it with this way
    guildSettings = await GuildModel.findOne({ guild_id: guildId });

    if (forceRemove || error && (error.code === 50013 || error.code === 50001 || error.code === 10003 || error.code === 40001)) {
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
