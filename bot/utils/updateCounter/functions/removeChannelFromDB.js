const GuildModel = require("../../../../mongooseModels/GuildModel");

module.exports = async ({ client, channelId, type, guildSettings, error, forceRemove }) => {
    const guildId = guildSettings.guild_id;
    console.log(
        `[Bot shard #${client.shard.id}] I tried to update ${guildId}'s counter (channel: ${channelId}), but I don't have the proper permissions or it does not exists.${(error) ? "Error code:" + error.code : "" }`
    );

    if (forceRemove || error && (error.code === 50013 || error.code === 50001 || error.code === 10003 || error.code === 40001)) {
        switch (type) {
            case "topicCounter":
                GuildModel.findOneAndUpdate({ guild_id: guildId }, {
                    $unset: { [`topicCounterChannels.${channelId}`]: "" }
                })
                    .then(() =>
                        console.log(
                            `[Bot shard #${client.shard.id}] [DB] Channel ${channelId} from the guild ${guildId} removed from topicCounterChannels.`
                        )
                    )
                    .catch(console.error);
                break;
            case "channelNameCounter":
                GuildModel.findOneAndUpdate({ guild_id: guildId }, {
                    $unset: { [`channelNameCounters.${channelId}`]: "" }
                })
                    .then(() =>
                        console.log(
                            `[Bot shard #${client.shard.id}] [DB] Channel ${channelId} from the guild ${guildId} removed from channelNameCounters.`
                        )
                    )
                    .catch(console.error);
                break;
        }
    }
};
