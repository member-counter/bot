const setChannelName = require("./functions/setChannelName");
const addTrack = require("../addTrack");

module.exports = (client, guildSettings) => {
    const {
        guild_id,
        channelNameCounters,
    } = guildSettings;
    
    if (client.guilds.has(guild_id) && client.guilds.get(guild_id).available) {
        channelNameCounters.forEach((channelNameCounter, channelId) => {
            if (channelNameCounter.type === "memberswithrole") {
                let targetRoles = channelNameCounter.otherConfig.roles;
                const guildRoles = client.guilds.get(guild_id).roles;
                let count = new Map();

                targetRoles.forEach(targetRoleId => {
                    if (guildRoles.has(targetRoleId))
                        guildRoles.get(targetRoleId).members.forEach(member => {
                            count.set(member.id);
                        });
                });

                addTrack(guild_id, "memberswithrole_count_history", count.size, { channelId });

                setChannelName({ client, channelId, channelName: channelNameCounter.channelName, count: count.size, guildSettings });
            }
        });
        //TODO
        //addTrack(guild_id, "role_count_history", count);
    }
};
