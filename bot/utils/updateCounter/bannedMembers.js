const setChannelName = require("./functions/setChannelName");
const addTrack = require("../addTrack");

module.exports = async (client, guildSettings) => {
    const {
        guild_id,
        channelNameCounters,
    } = guildSettings;
    
    if (client.guilds.has(guild_id) && client.guilds.get(guild_id).available) {
        const count = (await client.guilds.get(guild_id).fetchBans()).size;
        channelNameCounters.forEach((channelNameCounter, channelId) => {
            if (channelNameCounter.type === "bannedmembers")
                setChannelName({ client, channelId, channelName: channelNameCounter.channelName, count, guildSettings });
        });
        addTrack(guild_id, "banned_member_count_history", count);
    }
};
