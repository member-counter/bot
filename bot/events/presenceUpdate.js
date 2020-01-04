const updateCounter = require("../utils/updateCounter");

module.exports = client => {
    client.on("presenceUpdate", (oldMember, newMember) => {
        console.log("presenceUpdated", newMember.user.tag);
        const { guild, user } = newMember;
        let newStatus = newMember.presence.status;
        let oldStatus = oldMember.presence.status;

        //convert dnd/idle to online
        if (oldStatus !== "offline") oldStatus = "online";
        if (newStatus !== "offline") newStatus = "online";

        if (oldStatus !== newStatus) {
            let increment = {};
            let isBot = user.bot;
            if (newStatus === "online") {
                increment.onlineMembers = 1;
                if (isBot) increment.onlineBots = 1;
                else  increment.onlineUser = 1;
            } else {
                increment.offlineMembers = -1;
                if (isBot) increment.offlineBots = 1;
                else  increment.offlineUsers = 1;
            }
            updateCounter({client, guildSettings: guild.id, incrementCounters: increment});
        }
    });
};
