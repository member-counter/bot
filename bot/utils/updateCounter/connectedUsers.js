module.exports = (client, guildSettings) => {
    const {
        guild_id,
        channelNameCounter,
        channelNameCounter_types
    } = guildSettings;
    
    if (client.guilds.has(guild_id) && client.guilds.get(guild_id).available) {
        const count = 0; //TODO
        channelNameCounter.forEach((channel_name, channel_id) => {
            if (channelNameCounter_types.has(channel_id) && (channelNameCounter_types.get(channel_id) === "connectedusers"))
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
