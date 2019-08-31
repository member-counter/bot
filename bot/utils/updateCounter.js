const GuildModel = require('../../mongooseModels/GuildModel');

module.exports = (client, guild_id) => {
    if (client.guilds.has(guild_id) && client.guilds.get(guild_id).available) {
        GuildModel.findOne({guild_id})
            .then((guild_config) => {
                if (guild_config) {
                    const memberCount = client.guilds.get(guild_id).memberCount.toString().split('');
                    let memberCountCustomized = "";

                    memberCount.forEach(digit => {
                        memberCountCustomized += guild_config.custom_numbers[digit]
                    });

                    guild_config.enabled_channels.forEach(channel_id => {
                        //exists the channel?
                        if (client.channels.has(channel_id)) {
                            //is text type or news type?
                            if (client.channels.get(channel_id).type === "text" || client.channels.get(channel_id).type === "news") {
                                let topic = guild_config.unique_topics.has(channel_id) ? guild_config.unique_topics.get(channel_id) : guild_config.topic;
                                    topic = topic.replace(/\{COUNT\}/gi, memberCountCustomized);
                                client.channels.get(channel_id).setTopic(topic).catch(e => {
                                    //ignore errors caused by permissions 
                                    if (e.code !== 50013 || e.code !== 50001) console.error(e);
                                });
                            }
                        }
                    });
                }
            })
            .catch(console.error)
    }
}
