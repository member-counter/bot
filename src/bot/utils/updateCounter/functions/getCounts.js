const PREMIUM_BOT = JSON.parse(process.env.PREMIUM_BOT);

const getMembersRelatedCounts = (client, guildId) => {
    const guild = client.guilds.get(guildId);
    let counts = {
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
        for (const member of guild.members) {
            const memberIsOffline = member.status === "offline";
    
            if (member.bot) counts.bots++;
    
            if (memberIsOffline) counts.offlineMembers++;
            else counts.onlineMembers++;
    
            if (memberIsOffline && member.bot) counts.offlineBots++;
            else if (memberIsOffline) counts.offlineUsers++;
    
            if (!memberIsOffline && member.bot) counts.onlineBots++;
            else if (!memberIsOffline) counts.onlineUsers++;
        }
    }
        
    counts.users = counts.members - counts.bots;

    return counts;
}

const getChannels = (client, guildId) => {
    const guild = client.guilds.get(guildId);
    
    return guild.channels.filter(channel => channel.type !== 4).length;
}

//*counts members and users
const getConnectedUsers = (client, guildId) => {
    const guild = client.guilds.get(guildId);
    let count = new Map(); 

    guild.channels
        .filter(channel => channel.type == 2)
            .forEach(channel => {
                channel.voiceMembers
                    .forEach(member => count.set(member.id))
            });
    return count.size;
}

const getRoles = (client, guildId) => {
    const guild = client.guilds.get(guildId);
    return guild.roles.size;
}

module.exports = (client, guildId) => {
    if (client.guilds.has(guildId)) {
        return {
            ...getMembersRelatedCounts(client, guildId),
            connectedUsers: getConnectedUsers(client, guildId),
            channels: getChannels(client, guildId),
            roles: getRoles(client, guildId)
        }
    } else return {};
}