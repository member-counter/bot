const buildTopicCounter = require("./functions/buildTopicCounter");
const setChannelName = require("./functions/setChannelName");
const removeChannelFromDB = require("./functions/removeChannelFromDB");
const getCounts = require("./functions/getCounts");

const previousCounts = new Map();

/**
 * @param {(Object|string)} guildSettings Mongoose GuildModel
 * @param {Boolean} force Skips queue and updates all counters 
 */
module.exports = async ({ client, guildSettings, force = false }) => {
    const {
        guild_id,
        channelNameCounters,
        topicCounterChannels,
        mainTopicCounter
    } = guildSettings;

    const guild = client.guilds.get(guild_id);

    //check if there is any counter enabled to continue or just break
    if (channelNameCounters.size === 0 && topicCounterChannels.size === 0) return;
    if (!guild || guild.unavailable) return;

    let currentCount = getCounts(guild);
    let previousCount;

    if (!force && previousCounts.has(guild_id)) { 
        previousCount = previousCounts.get(guild_id);
    } else {
        previousCounts.delete(guild_id);
        previousCount = {};
        force = true;
    }
    
    //get banned members
    currentCount.bannedMembers = 0;
    if (
        Array.from(channelNameCounters).some((channel) => channel[1].type === "bannedmembers")
        || Array.from(topicCounterChannels).some((channel) => /\{bannedMembers\}/i.test(channel[1].topic))
        || /\{bannedMembers\}/i.test(mainTopicCounter)
    ) {
        await guild.getBans()
        .then(bans => currentCount.bannedMembers = bans.length)
        .catch(error => {        
            channelNameCounters.forEach((channelNameCounter, channelId) => {
                if (channelNameCounter.type === "bannedmembers") {
                    client.guilds.get(guild_id)
                        .channels.get(channelId)
                            .delete().catch(console.error);

                    removeChannelFromDB({
                        client,
                        guildSettings,
                        channelId,
                        type: "channelNameCounter",
                        error
                    });
                }
            })
        });
    }

    currentCount.connectedUsers = (() => {
        let count = new Map(); 

        guild.channels
            .filter(channel => channel.type == 2)
            .forEach(channel => {
                channel.voiceMembers
                    .forEach(member => count.set(member.id))
            });
        return count.size;
    })();

    //set counts
    //channelName counters:
    await Promise.all(
        channelNameCounters.map(async (channelNameCounter, channelId) => {
            let { channelName, type } = channelNameCounter;
            switch (type) {
                case "users":
                    if (previousCount.users !== currentCount.users)
                        await setChannelName({ client, channelId, channelName, count: currentCount.users, guildSettings });
                    break;

                case "bots":
                    if (previousCount.bots !== currentCount.bots)
                        await setChannelName({ client, channelId, channelName, count: currentCount.bots, guildSettings });
                    break;

                case "onlinemembers":
                    if (previousCount.onlineMembers !== currentCount.onlineMembers) {
                        await setChannelName({ client, channelId, channelName, count: currentCount.onlineMembers, guildSettings });
                    }
                    break;

                case "onlineusers":
                    if (previousCount.onlineUsers !== currentCount.onlineUsers)
                        await setChannelName({ client, channelId, channelName, count: currentCount.onlineUsers, guildSettings });
                    break;

                case "onlinebots":
                    if (previousCount.onlineBots !== currentCount.onlineBots)
                        await setChannelName({ client, channelId, channelName, count: currentCount.onlineBots, guildSettings });
                    break;

                case "offlinemembers":
                    if (previousCount.offlineMembers !== currentCount.offlineMembers)
                        await setChannelName({ client, channelId, channelName, count: currentCount.offlineMembers, guildSettings });
                    break;

                case "offlineusers":
                    if (previousCount.offlineUsers !== currentCount.offlineUsers)
                        await setChannelName({ client, channelId, channelName, count: currentCount.offlineUsers, guildSettings });
                    break;
                
                case "offlinebots":
                    
                    if (previousCount.offlineBots !== currentCount.offlineBots)
                        await setChannelName({ client, channelId, channelName, count: currentCount.offlineBots, guildSettings });
                    break;
                
                case "members":
                case undefined:
                    if (previousCount.members !== currentCount.members) {
                        await setChannelName({ client, channelId, channelName, count: currentCount.members, guildSettings });
                    }
                    break;

                case "bannedmembers":
                    if (previousCount.bannedMembers !== currentCount.bannedMembers) {
                        await setChannelName({ client, channelId, channelName, count: currentCount.bannedMembers, guildSettings });
                    }
                    break;

                case "connectedusers":
                    if (previousCount.connectedUsers !== currentCount.connectedUsers) {
                        await setChannelName({ client, channelId, channelName, count: currentCount.connectedUsers, guildSettings });
                    }
                    break;

                case "channels":
                    if (previousCount.channels !== currentCount.channels) {
                        await setChannelName({ client, channelId, channelName, count: currentCount.channels, guildSettings });
                    }
                    break;

                case "roles":
                    if (previousCount.roles !== currentCount.roles) {
                        await setChannelName({ client, channelId, channelName, count: currentCount.roles, guildSettings });
                    }
                    break;

                case "memberswithrole":
                    let count = new Map();
                    let targetRoles = channelNameCounter.otherConfig.roles;

                    targetRoles.forEach((targetRole) => {
                        guild.members.forEach((member) => {
                            if (member.roles.includes(targetRole)) count.set(member.id);
                        });
                    })

                    await setChannelName({ client, channelId, channelName: channelNameCounter.channelName, count: count.size, guildSettings });
                    break;
            }
        })
    )

    //topicCounters:
    const formatTopic = (topic) => {
        return topic
            .replace(/\{members\}|\{count\}/gi, buildTopicCounter(guildSettings, currentCount.members))
            .replace(/\{onlineMembers\}/gi, buildTopicCounter(guildSettings, currentCount.onlineMembers))
            .replace(/\{offlineMembers\}/gi, buildTopicCounter(guildSettings, currentCount.offlineMembers))
            .replace(/\{users\}/gi, buildTopicCounter(guildSettings, currentCount.users))
            .replace(/\{onlineUsers\}/gi, buildTopicCounter(guildSettings, currentCount.onlineUsers))
            .replace(/\{offlineUsers\}/gi, buildTopicCounter(guildSettings, currentCount.offlineUsers))
            .replace(/\{bots\}/gi, buildTopicCounter(guildSettings, currentCount.bots))
            .replace(/\{onlineBots\}/gi, buildTopicCounter(guildSettings, currentCount.onlineBots))
            .replace(/\{offlineBots\}/gi, buildTopicCounter(guildSettings, currentCount.offlineBots))
            .replace(/\{bannedMembers\}/gi, buildTopicCounter(guildSettings, currentCount.bannedMembers))
            .replace(/\{channels\}/gi, buildTopicCounter(guildSettings, currentCount.channels))
            .replace(/\{roles\}/gi, buildTopicCounter(guildSettings, currentCount.roles))
            .replace(/\{connectedUsers\}/gi, buildTopicCounter(guildSettings, currentCount.connectedUsers))
            .slice(0, 1023);
    }
    let globalTopicCounterFormatted = formatTopic(mainTopicCounter);

    topicCounterChannels.forEach((topicCounterChannel, channelId) => {
        const channel = guild.channels.get(channelId);
        //exists the channel?
        if (channel) {
            //is text type or news type?
            if (channel.type === 0 || channel.type === 5) {

                //the topic must be the main one or a specific one?
                let topicToSet = (topicCounterChannel.topic) ? topicCounterChannel.topic : globalTopicCounterFormatted;

                topicToSet = formatTopic(topicToSet);

                channel
                    .edit({
                        topic: topicToSet
                    })
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
    previousCounts.set(guild_id, {...currentCount});
};
