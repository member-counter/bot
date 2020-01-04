const updateCounter = require("../utils/updateCounter");

module.exports = client => {
    client.on("guildMemberRemove", member => {
        let increment = {};

        increment.members = -1;
        if (member.user.bot) {
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
