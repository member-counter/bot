module.exports = (client, guildSettings) => {
    const { guild_id } = guildSettings;
    if (client.guilds.has(guild_id) && client.guilds.get(guild_id).available) {
        const guild = client.guilds.get(guild_id);
        const { memberCount } = guild;

        //channel topic member count
        let memberCountCustomized = "";

        memberCount
            .toString()
            .split("")
            .forEach(digit => memberCountCustomized += guildSettings.custom_numbers[digit]);

        guildSettings.enabled_channels.forEach(channel_id => {
            //exists the channel?
            if (client.channels.has(channel_id)) {
                //is text type or news type?
                const channelType = client.channels.get(channel_id).type;
                if (channelType === "text" || channelType === "news") {
                    let topic = guildSettings.unique_topics.has(channel_id) ? guildSettings.unique_topics.get(channel_id) : guildSettings.topic;
                    topic = topic
                        .replace(/\{COUNT\}/gi, memberCountCustomized)
                        .slice(0, 1024);
                    client.channels
                        .get(channel_id)
                        .setTopic(topic)
                        .catch(e => {
                            //ignore errors caused by permissions
                            if (!(e.code === 50013 || e.code === 50001))
                                console.error(e);
                        });
                }
            }
        });

        //channel name member count
        //FIX
        guildSettings.channelNameCounter.forEach((channel_name, channel_id) => {
            //set the counters
            if (client.channels.has(channel_id)) {
                client.channels
                    .get(channel_id)
                    .setName(channel_name.replace(/\{COUNT\}/gi, count))
                    .catch(e => {
                        //ignore errors caused by permissions
                        if (!(e.code === 50013 || e.code === 50001))
                            console.error(e);
                    });
            }
        });
    }
};
