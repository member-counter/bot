const addTrack = require("../../addTrack");
const buildTopicCounter = require("./buildTopicCounter");
const setChannelName = require("./setChannelName");
const removeChannelFromDB = require("./removeChannelFromDB");

const previousCounts = new Map();
/**
 * This is what actually updates the counters, the module.exports is just a queue
 * @param {Object} client Discord client
 * @param {(Object|string)} guild Mongoose GuildModel or Discord guild id
 * @param {Boolean} force Skips queue and updates all counters 
 */
module.exports = async (client, guildSettings, force = false) => {
    const {
        guild_id,
        channelNameCounters,
        topicCounterChannels,
        mainTopicCounter
    } = guildSettings;

    //check if there is any counter enabled to continue or just break
    if (channelNameCounters.size === 0 && topicCounterChannels.size === 0) return;

    if (client.guilds.has(guild_id) && client.guilds.get(guild_id).available) {
        const guild = client.guilds.get(guild_id);

        if (force) previousCounts.delete(guild_id);
    
        //Prepare counts
        let baseCounts = {
            members: null,
            users: null,
            bots: null,
            onlineMembers: null,
            onlineUsers: null,
            onlineBots: null,
            offlineMembers: null,
            offlineUsers: null,
            offlineBots: null,
            channels: null,
            connectedUsers: null,
            bannedMembers: null,
            roles: null
        };

        let currentCount, previousCount;

        if (previousCounts.has(guild_id)) { 
            currentCount = Object.create(previousCounts.get(guild_id));
            previousCount = Object.create(previousCounts.get(guild_id));
        } else {
            currentCount = Object.create(baseCounts);
            previousCount = Object.create(baseCounts);
            force = true;
        }
        
        //members related counts
        currentCount.members = guild.memberCount;
        currentCount.bots = 0;
        currentCount.users = 0;
        currentCount.onlineMembers = 0;
        currentCount.offlineMembers = 0;
        currentCount.onlineUsers = 0;
        currentCount.offlineUsers = 0;
        currentCount.onlineBots = 0;
        currentCount.offlineBots = 0;

        for (let i of guild.members.keys()) {
            const member = guild.members.get(i);
            
            const memberIsOffline = member.presence.status === "offline";
            const memberIsBot = member.user.bot;

            if (memberIsBot) currentCount.bots++;

            if (memberIsOffline) currentCount.offlineMembers++;
            else currentCount.onlineMembers++;

            if (memberIsOffline && memberIsBot) currentCount.offlineBots++;
            else if (memberIsOffline) currentCount.offlineUsers++;

            if (!memberIsOffline && memberIsBot) currentCount.onlineBots++;
            else if (!memberIsOffline) currentCount.onlineUsers++;
        }
        
        currentCount.users = currentCount.members - currentCount.bots;

        //banned members
        currentCount.bannedMembers = 0;
        await guild.fetchBans()
            .then(bans => currentCount.bannedMembers = bans.size)
            .catch(error => {        
                channelNameCounters.forEach((channelNameCounter, channelId) => {
                    if (channelNameCounter.type === "bannedmembers") {
                        client.channels.get(channelId)
                            .delete()
                                .catch(console.error);

                        removeChannelFromDB({
                            client,
                            guildSettings,
                            channelId,
                            type: "channelNameCounter",
                            error
                        });
                    }
                });
            });
    
    
        currentCount.channels = 0;
        currentCount.channels = guild.channels.filter(channel => channel.type !== "category").size; //exclude categories
    
        //roles
        currentCount.roles = 0;
        currentCount.roles = guild.roles.size;
        
        //connected vc members
        currentCount.connectedUsers = 0;
        let count = new Map(); 
        guild.channels.forEach(channel => {
            if (channel.type === "voice") {
                channel.members.forEach(member => {
                    count.set(member.id);
                });
            }
        });
        currentCount.connectedUsers = count.size;
    
        //used to check if tracks are already added or not to avoid duplicates
        let isTrackAlreadyAdded = {
            onlineMembers: false,
            members: false,
            bannedMembers: false,
            roles: false,
            channels: false,
            connectedUsers: false

        };

        //set counts
        //channelName counters:
        channelNameCounters.forEach((channelNameCounter, channelId) => {
            let { channelName, type } = channelNameCounter;
            switch (type) {
                case "users":
                    if (previousCount.users !== currentCount.users)
                        setChannelName({ client, channelId, channelName, count: currentCount.users, guildSettings });
                    break;

                case "bots":
                    if (previousCount.bots !== currentCount.bots)
                        setChannelName({ client, channelId, channelName, count: currentCount.bots, guildSettings });
                    break;

                case "onlinemembers":
                    if (previousCount.onlineMembers !== currentCount.onlineMembers) {
                        setChannelName({ client, channelId, channelName, count: currentCount.onlineMembers, guildSettings });
                        if (!isTrackAlreadyAdded.onlineMembers) {
                            addTrack(guild_id, "online_member_count_history", currentCount.onlineMembers);
                            isTrackAlreadyAdded.onlineMembers = true;
                        }
                    }
                    break;

                case "onlineusers":
                    if (previousCount.onlineUsers !== currentCount.onlineUsers)
                        setChannelName({ client, channelId, channelName, count: currentCount.onlineUsers, guildSettings });
                    break;

                case "onlinebots":
                    if (previousCount.onlineBots !== currentCount.onlineBots)
                        setChannelName({ client, channelId, channelName, count: currentCount.onlineBots, guildSettings });
                    break;

                case "offlinemembers":
                    if (previousCount.offlineMembers !== currentCount.offlineMembers)
                        setChannelName({ client, channelId, channelName, count: currentCount.offlineMembers, guildSettings });
                    break;

                case "offlineusers":
                    if (previousCount.offlineUsers !== currentCount.offlineUsers)
                        setChannelName({ client, channelId, channelName, count: currentCount.offlineUsers, guildSettings });
                    break;
                
                case "offlinebots":
                    if (previousCount.offlineBots !== currentCount.offlineBots)
                        setChannelName({ client, channelId, channelName, count: currentCount.offlineBots, guildSettings });
                    break;
                
                case "members":
                case undefined:
                    if (previousCount.members !== currentCount.members) {
                        if (!isTrackAlreadyAdded.members) {
                            addTrack(guild_id, "member_count_history", currentCount.members);
                            isTrackAlreadyAdded.members = true;
                        }
                        setChannelName({ client, channelId, channelName, count: currentCount.members, guildSettings });
                    }
                    break;

                case "bannedmembers":
                    if (previousCount.bannedMembers !== currentCount.bannedMembers) {
                        if (!isTrackAlreadyAdded.bannedMembers) {
                            addTrack(guild_id, "banned_member_count_history", currentCount.bannedMembers);
                            isTrackAlreadyAdded.bannedMembers = true;
                        }
                        setChannelName({ client, channelId, channelName, count: currentCount.bannedMembers, guildSettings });
                    }
                    break;

                case "connectedusers":
                    if (previousCount.connectedUsers !== currentCount.connectedUsers) {
                        if (!isTrackAlreadyAdded.connectedUsers) {
                            addTrack(guild_id, "vc_connected_members_count_history", currentCount.connectedUsers);
                            isTrackAlreadyAdded.connectedUsers = true;
                        }
                        setChannelName({ client, channelId, channelName, count: currentCount.connectedUsers, guildSettings });
                    }
                    break;

                case "channels":
                    if (previousCount.channels !== currentCount.channels) {
                        if (!isTrackAlreadyAdded.channels) {
                            addTrack(guild_id, "channel_count_history", currentCount.channels);
                            isTrackAlreadyAdded.channels = true;
                        }
                        setChannelName({ client, channelId, channelName, count: currentCount.channels, guildSettings });
                    }
                    break;

                case "roles":
                    if (previousCount.roles !== currentCount.roles) {
                        if (!isTrackAlreadyAdded.roles) {
                            addTrack(guild_id, "role_count_history", currentCount.roles);
                            isTrackAlreadyAdded.roles = true;
                        }
                        setChannelName({ client, channelId, channelName, count: currentCount.roles, guildSettings });
                    }
                    break;

                case "memberswithrole":
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
                    break;
            }
        });

        //topicCounters:
        const formatTopic = (topic) => {
            return topic
                .replace(/\{members\}|\{count\}/gi, buildTopicCounter(guildSettings, currentCount.members))
                .replace(/\{onlineMembers\}/gi, buildTopicCounter(guildSettings, currentCount.onlineMembers))
                .replace(/\{offlineMembers\}/gi, buildTopicCounter(guildSettings, currentCount.offlineMembers))
                .replace(/\{onlineUsers\}/gi, buildTopicCounter(guildSettings, currentCount.onlineUsers))
                .replace(/\{offlineUsers\}/gi, buildTopicCounter(guildSettings, currentCount.offlineUsers))
                .replace(/\{onlineBots\}/gi, buildTopicCounter(guildSettings, currentCount.onlineBots))
                .replace(/\{offlineBots\}/gi, buildTopicCounter(guildSettings, currentCount.offlineBots))
                .replace(/\{bannedMembers\}/gi, buildTopicCounter(guildSettings, currentCount.bannedMembers))
                .replace(/\{channels\}/gi, buildTopicCounter(guildSettings, currentCount.channels))
                .replace(/\{roles\}/gi, buildTopicCounter(guildSettings, currentCount.roles))
                .replace(/\{connectedUsers\}/gi, buildTopicCounter(guildSettings, currentCount.connectedUsers))
                .slice(0, 1024);
        }
        let globalTopicCounterFormatted = formatTopic(mainTopicCounter);

            topicCounterChannels.forEach((topicCounterChannel, channelId) => {
                //exists the channel?
                if (client.channels.has(channelId)) {
                    //is text type or news type?
                    const channelType = client.channels.get(channelId).type;
                    if (channelType === "text" || channelType === "news") {
    
                        //the topic must be the main one or a specific one?
                        let topicToSet = (topicCounterChannel.topic) ? topicCounterChannel.topic : globalTopicCounterFormatted;
    
                        topicToSet = formatTopic(topicToSet);
    
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

        //cache counts to check in a future if its necessary to update the channel name and the topic
        previousCounts.set(guild_id, currentCount);
    }
};