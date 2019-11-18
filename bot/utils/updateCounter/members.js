const setChannelName = require("./functions/setChannelName");
const removeChannelFromDB = require("./functions/removeChannelFromDB");

//idk anymore what does this
const previousCounts = new Map();

module.exports = (client, guildSettings, types = []) => {
    const {
        guild_id,
        channelNameCounters,
        topicCounterCustomNumbers,
        topicCounterChannels,
        mainTopicCounter
    } = guildSettings;

    if (types.includes("force")) previousCounts.delete(guild_id);

    if (client.guilds.has(guild_id) && client.guilds.get(guild_id).available) {
        const guild = client.guilds.get(guild_id);

        //counts
        let previousCount = previousCounts.has(guild_id) ? previousCounts.get(guild_id) : previousCounts.set(guild_id, {}),
            members,
            users,
            bots,
            onlineMembers,
            onlineUsers,
            onlineBots,
            offlineMembers,
            offlineUsers,
            offlineBots;

        //Get all counts
        members = guild.memberCount;
        bots = guild.members.filter(member => member.user.bot).size;
        users = members - bots;
        
        offlineMembers = 0;
        offlineUsers = 0;
        offlineBots = 0;
        onlineMembers = 0;
        onlineBots = 0;      
        onlineUsers = 0;

        guild.members.forEach(member => {
            if (member.presence.status === "offline") offlineMembers++;
            else onlineMembers++;

            if (member.presence.status === "offline" && member.user.bot) offlineBots++;
            else if (member.presence.status === "offline") offlineUsers++;

            if (member.presence.status !== "offline" && member.user.bot) onlineBots++;
            else if (member.presence.status !== "offline") onlineUsers++;
        });

        //set counts in channel names
        channelNameCounters.forEach((channelNameCounter, channelId) => {
            let { channelName, type } = channelNameCounter; 
            switch (type) {
                case "users":
                    if (previousCount.users !== users) setChannelName({ client, channelId, channelName, count: users, guildSettings });
                    break;

                case "bots":
                    if (previousCount.bots !== bots) setChannelName({ client, channelId, channelName, count: bots, guildSettings });
                    break;

                case "onlinemembers":
                    if (previousCount.onlineMembers !== onlineMembers) setChannelName({ client, channelId, channelName, count: onlineMembers, guildSettings });
                    break;

                case "onlineusers":
                    if (previousCount.onlineUsers !== onlineUsers) setChannelName({ client, channelId, channelName, count: onlineUsers, guildSettings });
                    break;

                case "onlinebots":
                    if (previousCount.onlineBots !== onlineBots) setChannelName({ client, channelId, channelName, count: onlineBots, guildSettings });
                    break;

                case "offlinemembers":
                    if (previousCount.offlineMembers !== offlineMembers) setChannelName({ client, channelId, channelName, count: offlineMembers, guildSettings });
                    break;

                case "offlineusers":
                    if (previousCount.offlineUsers !== offlineUsers) setChannelName({ client, channelId, channelName, count: offlineUsers, guildSettings });
                    break;
                
                case "offlinebots":
                    if (previousCount.offlineBots !== offlineBots) setChannelName({ client, channelId, channelName, count: offlineBots, guildSettings });
                    break;

                case "members":
                case undefined:
                    if (previousCount.members !== members) setChannelName({ client, channelId, channelName, count: members, guildSettings });
                    break;
            }
        });

        //set counts in channel topics
        let memberCountCustomized = "";

        members
            .toString()
            .split("")
            .forEach(digit => (memberCountCustomized += topicCounterCustomNumbers[digit]));

        if (previousCount.members !== members) {
            topicCounterChannels.forEach((topicCounterChannel, channelId) => {
                //exists the channel?
                if (client.channels.has(channelId)) {
                    //is text type or news type?
                    const channelType = client.channels.get(channelId).type;
                    if (channelType === "text" || channelType === "news") {
    
                        //the topic must be the main one or a specific one?
                        let topicToSet = (topicCounterChannel.topic)
                            ? topicCounterChannel.topic
                            : mainTopicCounter;
    
                        topicToSet = topicToSet
                            .replace(/\{COUNT\}/gi, memberCountCustomized)
                            .slice(0, 1024);
    
                        client.channels
                            .get(channelId)
                            .setTopic(topicToSet)
                            .catch(error => {
                                removeChannelFromDB({ client, guildSettings, error, channelId, type: "topicCounter" });
                                console.error(error);
                            });
                    }
                } else {
                    removeChannelFromDB({
                        client,
                        guildSettings,
                        channelId,
                        type: "topicCounter", 
                        forceRemove: true
                    });
                }
            });
        }

        //cache counts to avoid bad stuff
        previousCounts.set(guild_id, {
            members,
            users,
            bots,
            onlineMembers,
            onlineUsers,
            onlineBots,
            offlineMembers,
            offlineUsers,
            offlineBots
        });
    }
};
//Dedicated to Alex, I'm gonna release this without even know if this works
