const getMembersRelatedCounts = (bot, guildId) => {
    const guild = bot.client.guilds.get(guildId);
    let counts = {};
    
    counts.members = guild.memberCount;
    counts.bots = 0;
    counts.users = 0;
    counts.onlineMembers = 0;
    counts.offlineMembers = 0;
    counts.onlineUsers = 0;
    counts.offlineUsers = 0;
    counts.onlineBots = 0;
    counts.offlineBots = 0;

    for (let i of guild.members.keys()) {
        const member = guild.members.get(i);
        
        const memberIsOffline = member.status === "offline";
        const memberIsBot = member.bot;

        if (memberIsBot) counts.bots++;

        if (memberIsOffline) counts.offlineMembers++;
        else counts.onlineMembers++;

        if (memberIsOffline && memberIsBot) counts.offlineBots++;
        else if (memberIsOffline) counts.offlineUsers++;

        if (!memberIsOffline && memberIsBot) counts.onlineBots++;
        else if (!memberIsOffline) counts.onlineUsers++;
    }
        
    counts.users = counts.members - counts.bots;

    return counts;
}

const getChannels = (bot, guildId) => {
    const guild = bot.client.guilds.get(guildId);
    
    return guild.channels.filter(channel => channel.type !== 4).length;
}

//*counts members and users
const getConnectedUsers = (bot, guildId) => {
    const guild = bot.client.guilds.get(guildId);
    let count = new Map(); 

    guild.channels
        .filter(channel => channel.type == 2)
            .forEach(channel => {
                channel.voiceMembers
                    .forEach(member => count.set(member.id))
            });
    return count.size;
}

const getRoles = (bot, guildId) => {
    const guild = bot.client.guilds.get(guildId);
    return guild.roles.size;
}

const generateBaseCounts = (bot, guildId) => {
    if (bot.client.guilds.has(guildId)) {
        return {
            ...getMembersRelatedCounts(bot, guildId),
            connectedUsers: getConnectedUsers(bot, guildId),
            channels: getChannels(bot, guildId),
            roles: getRoles(bot, guildId)
        }
    } else return {};
}


module.exports = {
    generateBaseCounts,
    getMembersRelatedCounts,
    getChannels,
    getRoles,
    getConnectedUsers
}