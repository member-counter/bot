//FIX optimize this
const GuildModel = require('../../mongooseModels/GuildModel');

module.exports = (client, guild_id) => {
    if (client.guilds.has(guild_id) && client.guilds.get(guild_id).available) {
        const guild = client.guilds.get(guild_id);
        GuildModel.findOne({guild_id})
            .then((guild_config) => {
                if (guild_config) {
                    const { memberCount } = guild;

                    //channel topic member count
                    let memberCountCustomized = "";

                    memberCount
                        .toString()
                        .split("")
                        .forEach(digit => memberCountCustomized += guild_config.custom_numbers[digit]);

                    guild_config.enabled_channels
                        .forEach(channel_id => {
                            //exists the channel?
                            if (client.channels.has(channel_id)) {
                                //is text type or news type?
                                const channelType = client.channels.get(channel_id).type;
                                if (channelType === "text" || channelType === "news") {
                                    let topic = guild_config.unique_topics.has(channel_id) ? guild_config.unique_topics.get(channel_id) : guild_config.topic;
                                        topic = topic.replace(/\{COUNT\}/gi, memberCountCustomized).slice(0, 1024);
                                    client.channels.get(channel_id).setTopic(topic).catch(e => {
                                        //ignore errors caused by permissions 
                                        if (!(e.code === 50013 || e.code === 50001)) console.error(e);
                                    });
                                }
                            }
                        });

                    //channel name member count
                    const availableCounterTypes = ["members", "users", "bots", "roles", "channels", "onlineusers", "offlineusers", "connectedusers"];
                    let usersCountCache, botsCountCache, onlineUsersCountCache, offlineUsersCountCache, onnectedUsersCountCache;

                    guild_config.channelNameCounter
                        .forEach((channel_name, channel_id) => {
                            //get the count type
                            let count, countType;
                            if (guild_config.channelNameCounter_types.has(channel_id)) {
                                countType = guild_config.channelNameCounter_types.get(channel_id);
                                //check if the counter type is available, if it is not, use "members" as a type
                                if (!availableCounterTypes.includes(countType)) {
                                    countType = "members";
                                }
                            } else {
                                //"members" by default for those channels that has been created without the choice to be other type
                                countType = "members";
                            }

                            switch (countType) {
                                case "members":
                                    count = memberCount;
                                    break;
                                
                                case "users":
                                    if (usersCountCache === undefined) usersCountCache = guild.members.filter(member => !member.user.bot).size;
                                    count = usersCountCache;
                                    break;
                                
                                case "bots":
                                    if (botsCountCache === undefined) botsCountCache = guild.members.filter(member => member.user.bot).size;
                                    count = botsCountCache;
                                    break;
                                    
                                case "roles":
                                    count = guild.roles.size;
                                    break;

                                case "channels":
                                    count = guild.channels.size;
                                    break;
                                
                                case "onlineusers":
                                    count;
                                    break;
                                
                                case "offlineusers":

                                    break;
                                
                                case "connectedusers":
                                    //connected users to a voice channel
                                    break;
                                default:
                                    break;
                            }

                            //set the counters
                            if (client.channels.has(channel_id)) {
                                client.channels.get(channel_id).setName(channel_name.replace(/\{COUNT\}/gi, count)).catch(e => {
                                    //ignore errors caused by permissions 
                                    if (!(e.code === 50013 || e.code === 50001)) console.error(e);
                                });
                            }
                        });
                }
            })
            .catch(console.error)
    }
}
