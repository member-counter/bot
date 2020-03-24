const PREMIUM_BOT = JSON.parse(process.env.PREMIUM_BOT);
const { DISCORD_CLIENT_ID } = process.env;

const getBannedMembers = async (guild, guildSettings) => {
    const { channelNameCounters, topicCounterChannels, mainTopicCounter } = guildSettings;
    const botMember = guild.members.get(DISCORD_CLIENT_ID);

    // Check if there is some counter of banned members and if the bot has perms to see banned members to avoid unncessary requests
    if (
        (
            (botMember.permission.allow & 0x8 ) === 0x8
            || (botMember.permission.allow & 0x4 ) === 0x4
        )
        &&
        (
            Array.from(channelNameCounters).some((channel) => channel[1].type === "bannedmembers")
            || Array.from(topicCounterChannels).some((channel) => /\{bannedMembers\}/i.test(channel[1].topic))
            || /\{bannedMembers\}/i.test(mainTopicCounter)
        )
    ) {
        return await guild.getBans()
            .then(bans => bans.length)
            .catch(error => {
                console.error(error);
                return 'Error';
            });
    } 

    return 'Error';
}

const getMembersRelatedCounts = (guild, guildSettings) => {
    const counts = {
        members: guild.memberCount,
        bots: 0,
        users: 0,
        onlineMembers: 0,
        offlineMembers: 0,
        onlineUsers: 0,
        offlineUsers: 0,
        onlineBots: 0,
        offlineBots: 0,
    };

    if (PREMIUM_BOT) {
        for (const member in guild.members) {
            const memberIsOffline = member.status === "offline";

            if (member.bot) counts.bots++;

            if (memberIsOffline) counts.offlineMembers++;
            else counts.onlineMembers++;

            if (memberIsOffline && member.bot) counts.offlineBots++;
            else if (memberIsOffline) counts.offlineUsers++;

            if (!memberIsOffline && member.bot) counts.onlineBots++;
            else if (!memberIsOffline) counts.onlineUsers++;
        }

        counts.users = counts.members - counts.bots;
    } else {
        // If the bot is in non-premium mode, replace all member related counts
        // except members to 'Only Premium'
        for (const key in counts) {
            if (key !== 'members') counts[key] = 'Only Premium'; // TODO add translation
        }
    }

    return counts;
}

const getConnectedUsers = (guild) => {
    let count = new Map();
    guild.channels
        .filter(channel => channel.type == 2)
        .forEach(channel => {
            channel.voiceMembers
                .forEach(member => count.set(member.id))
        });
    return count.size;
}

// Exclude categories
const getChannels = (guild) => guild.channels.filter(channel => channel.type !== 4).length;

module.exports = async (client, guildSettings) => {
    const guild = client.guilds.get(guildSettings.guild_id);

    return {
        ...getMembersRelatedCounts(guild, guildSettings),
        bannedMembers: await getBannedMembers(guild, guildSettings),
        connectedUsers: getConnectedUsers(guild),
        channels: getChannels(guild),
        roles: guild.roles.size
    }
}