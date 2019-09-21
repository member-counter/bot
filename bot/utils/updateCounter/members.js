module.exports = (client, guildSettings) => {
    const {
        guild_id,
        enabled_channels,
        custom_numbers,
        unique_topics,
        topic,
        channelNameCounter,
        channelNameCounter_types
    } = guildSettings;
    if (client.guilds.has(guild_id) && client.guilds.get(guild_id).available) {
        const guild = client.guilds.get(guild_id);
        const { memberCount } = guild;

        //channel topic member count
        let memberCountCustomized = "";

        memberCount
            .toString()
            .split("")
            .forEach(digit => (memberCountCustomized += custom_numbers[digit]));

        enabled_channels.forEach(channel_id => {
            //exists the channel?
            if (client.channels.has(channel_id)) {
                //is text type or news type?
                const channelType = client.channels.get(channel_id).type;
                if (channelType === "text" || channelType === "news") {
                    let topicToSet = unique_topics.has(channel_id)
                        ? unique_topics.get(channel_id)
                        : topic;
                    topicToSet = topicToSet
                        .replace(/\{COUNT\}/gi, memberCountCustomized)
                        .slice(0, 1024);
                    client.channels
                        .get(channel_id)
                        .setTopic(topicToSet)
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
            }
        });

        //channel name member count
        channelNameCounter.forEach((channel_name, channel_id) => {
            const updateCounter = () => {
                if (client.channels.has(channel_id)) {
                    const nameToSet = channel_name.replace(/\{COUNT\}/gi, memberCount);
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
            }
            //some channels are supossed to be a member counter but they could not be inside channelNameCounter_types
            if (!channelNameCounter_types.has(channel_id)) {
                updateCounter();
            } else if (channelNameCounter_types.get(channel_id) === "members") {
                updateCounter();
            }
        });
    }
};
