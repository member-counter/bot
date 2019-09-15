module.exports = (client, guildSettings) => {
    const {
        guild_id,
        channelNameCounter,
        channelNameCounter_types
    } = guildSettings;

    const count = 0;//TODO
    
    if (client.guilds.has(guild_id) && client.guilds.get(guild_id).available) {
        channelNameCounter.forEach((channel_name, channel_id) => {
            if (channelNameCounter_types.has(channel_id) && (channelNameCounter_types.get(channel_id) === "offlineusers"))
                if (client.channels.has(channel_id)) {
                    const nameToSet = channel_name.replace(/\{COUNT\}/gi, count);
                    client.channels
                        .get(channel_id)
                        .setName(nameToSet)
                        .catch(e => {
                            //ignore errors caused by permissions
                            if (!(e.code === 50013 || e.code === 50001))
                                console.error(e);
                        });
                }
        });
    }
};
