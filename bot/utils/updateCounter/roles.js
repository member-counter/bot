const setChannelName = require("./functions/setChannelName");
const addTrack = require("../addTrack");

module.exports = (client, guildSettings) => {
    const {
        guild_id,
        channelNameCounters,
    } = guildSettings;
    
    if (client.guilds.has(guild_id) && client.guilds.get(guild_id).available) {
        const count = client.guilds.get(guild_id).roles.size;
        
        channelNameCounters.forEach((channelNameCounter, channelId) => {
            if (channelNameCounter.type === "roles")
                setChannelName({ client, channelId, channelName: channelNameCounter.channelName, count, guildSettings });
        });
        addTrack(guild_id, "role_count_history", count);
    }
};
