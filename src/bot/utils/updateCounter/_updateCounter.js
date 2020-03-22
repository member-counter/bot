const replaceWithCustomDigits = require("./functions/replaceWithCustomDigits");
const setChannelName = require("./functions/setChannelName");
const removeChannelFromDB = require("./functions/removeChannelFromDB");
const getCounts = require("./functions/getCounts");
const getMembersWithRolesCount = require("./functions/getMembersWithRolesCount");

/**
 * @param {(Object|string)} guildSettings Mongoose GuildModel
 * @param {Boolean} forceUpdate Skips queue and updates all counters 
 */


module.exports = async ({ client, guildSettings }) => {
    const {
        guild_id,
        channelNameCounters,
        topicCounterChannels,
        mainTopicCounter,
        topicCounterCustomNumbers
    } = guildSettings;

    const guild = client.guilds.get(guild_id);

    // check if there is any counter enabled to continue
    if (channelNameCounters.size === 0 && topicCounterChannels.size === 0) return;

    // check if the guild is available
    if (!guild || guild.unavailable) return;
    
    let counts = await getCounts(client, guildSettings);

    // counts properties to lowercase
    // used later to get the counts
    // because the types specified by the user are in lowercase
    for (let key in counts) {
        const loweredCaseKey = key.toLowerCase();
        if (counts[loweredCaseKey] !== counts[key]) {
            counts[loweredCaseKey] = counts[key];
            delete counts[key];
        }
    }

    // set counts in channelName counters:
    for (const [channelId, channelNameCounter] of Array.from(channelNameCounters)) {
        let { channelName, type } = channelNameCounter;
        switch (type) {
            // backwards compatibility with a very early version
            case undefined:
                await setChannelName({ client, channelId, channelName, count: counts.members, guildSettings });
                break;

            case "memberswithrole": {
                let count  = getMembersWithRolesCount(guild, channelNameCounter.otherConfig.roles);
                await setChannelName({ client, channelId, channelName: channelNameCounter.channelName, count, guildSettings });
                break;
            }
            default: {
                await setChannelName({ client, channelId, channelName, count: counts[type], guildSettings });
                break;
            }
        }
    }

    //topicCounters:
    const formatTopic = (topic) => {
        return topic
            .replace(/\{members\}|\{count\}/gi, replaceWithCustomDigits(topicCounterCustomNumbers, counts.members))
            .replace(/\{onlineMembers\}/gi,     replaceWithCustomDigits(topicCounterCustomNumbers, counts.onlinemembers))
            .replace(/\{offlineMembers\}/gi,    replaceWithCustomDigits(topicCounterCustomNumbers, counts.offlinemembers))
            .replace(/\{users\}/gi,             replaceWithCustomDigits(topicCounterCustomNumbers, counts.users))
            .replace(/\{onlineUsers\}/gi,       replaceWithCustomDigits(topicCounterCustomNumbers, counts.onlineusers))
            .replace(/\{offlineUsers\}/gi,      replaceWithCustomDigits(topicCounterCustomNumbers, counts.offlineusers))
            .replace(/\{bots\}/gi,              replaceWithCustomDigits(topicCounterCustomNumbers, counts.bots))
            .replace(/\{onlineBots\}/gi,        replaceWithCustomDigits(topicCounterCustomNumbers, counts.onlinebots))
            .replace(/\{offlineBots\}/gi,       replaceWithCustomDigits(topicCounterCustomNumbers, counts.offlinebots))
            .replace(/\{bannedMembers\}/gi,     replaceWithCustomDigits(topicCounterCustomNumbers, counts.bannedmembers))
            .replace(/\{channels\}/gi,          replaceWithCustomDigits(topicCounterCustomNumbers, counts.channels))
            .replace(/\{roles\}/gi,             replaceWithCustomDigits(topicCounterCustomNumbers, counts.roles))
            .replace(/\{connectedUsers\}/gi,    replaceWithCustomDigits(topicCounterCustomNumbers, counts.connectedusers))
            .slice(0, 1023);
    };

    const globalTopicCounterFormatted = formatTopic(mainTopicCounter);

    for (const [channelId, topicCounterChannel] of Array.from(topicCounterChannels)) {
        const channel = guild.channels.get(channelId);

        // is text type or news type?
        if (channel && (channel.type === 0 || channel.type === 5)) {
            // the topic must be the main one or a specific one?
            let topicToSet = (topicCounterChannel.topic) ? formatTopic(topicCounterChannel.topic) : globalTopicCounterFormatted;

            // check if it's necessary to edit the channel
            if (channel.topic !== topicToSet) {
                await channel
                    .edit({ topic: topicToSet })
                    .catch(error => {
                        console.error(error);
                        removeChannelFromDB({ client, guildSettings, error, channelId, type: "topicCounter" });
                    });
            }
        } else {
            removeChannelFromDB({ client, guildSettings, channelId, type: "topicCounter", forceRemove: true });
        }
    }
};
