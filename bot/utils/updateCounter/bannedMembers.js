const setChannelName = require("./functions/setChannelName");
const removeChannelFromDB = require("./functions/removeChannelFromDB");

const addTrack = require("../addTrack");

module.exports = async (client, guildSettings) => {
    const {
        guild_id,
        channelNameCounters,
    } = guildSettings;
    
    if (client.guilds.has(guild_id) && client.guilds.get(guild_id).available) {
        client.guilds.get(guild_id)
            .fetchBans()
                .then(bans => {
                    const count = bans.size;
                    channelNameCounters.forEach((channelNameCounter, channelId) => {
                        if (channelNameCounter.type === "bannedmembers")
                            setChannelName({ client, channelId, channelName: channelNameCounter.channelName, count, guildSettings });
                    });
                    addTrack(guild_id, "banned_member_count_history", count);
                })
                .catch(error => {        
                    channelNameCounters.forEach((channelNameCounter, channelId) => {
                        if (channelNameCounter.type === "bannedmembers") {
                            client.channels.get(channelId)
                                .delete()
                                    .catch(console.error);

                            removeChannelFromDB({
                                client,
                                guildSettings,
                                channelId,
                                type: "channelNameCounter",
                                error
                            });
                        }
                    });
                });
    }
};
