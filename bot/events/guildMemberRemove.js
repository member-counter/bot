const updateCounter = require("../utils/updateCounter");

module.exports = client => {
    client.on("guildMemberRemove", member => {
        console.log("guildMemberRemove", member.user.tag)
        let isBot = member.user.bot;
        
        let increment = {};
        increment.members = -1;
        if (isBot) {
            increment.bots = -1;
            if (member.presence.status === "online") {
                increment.offlineMembers = -1;
                increment.offlineBots = -1;
            } else {
                increment.onlineBots = -1;
            }
        }
        else {
            increment.user = -1;
            if (member.presence.status === "online") {
                increment.offlineMembers = -1;
                increment.offlineUsers = -1;
            } else {
                increment.onlineMembers = -1;
                increment.onlineUsers = -1;
            }
        }
        updateCounter({client, guildSettings: member.guild.id, incrementCounters: increment});
    });
};
