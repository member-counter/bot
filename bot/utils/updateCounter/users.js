module.exports = (client, guildSettings) => {
    const {
        guild_id,
        channelNameCounter,
        channelNameCounter_types
    } = guildSettings;

    if (client.guilds.has(guild_id) && client.guilds.get(guild_id).available) {
        const count = client.guilds.get(guild_id).members.filter(member => !member.user.bot).size;
        channelNameCounter.forEach((channel_name, channel_id) => {
            if (channelNameCounter_types.has(channel_id) && (channelNameCounter_types.get(channel_id) === "users"))
                if (client.channels.has(channel_id)) {
                    const nameToSet = channel_name.replace(/\{COUNT\}/gi, count);
                    client.channels
                        .get(channel_id)
                        .setName(nameToSet)
                        .catch(e => {
                            //errors caused by permissions
                            if (e.code === 50013 || e.code === 50001)
                                console.log(
                                    `[Bot shard #${client.shard.id}] I tried to update ${guild_id}'s counter, but I don't have the proper permissions. Error code: ${e.code}`
                                );
                            else {
                                console.error(e);
                            }
                        });
                }
        });
    }
};
