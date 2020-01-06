const updateCounter = require("../utils/updateCounter");
const guildCounts = require("../utils/guildCounts");

module.exports = client => {
    client.on("presenceUpdate", (oldMember, member) => {
        const { guild, user } = member;
        let newStatus = member.presence.status;
        let oldStatus = oldMember.presence.status;

        //convert dnd/idle to online
        if (oldStatus !== "offline") oldStatus = "online";
        if (newStatus !== "offline") newStatus = "online";

        if (oldStatus !== newStatus) {
            const guildCount = guildCounts.get(member.guild.id);
    
            if (newStatus === "online") {
                guildCount.increment("onlineMembers", 1);
                if (user.bot) guildCount.increment("onlineBots", 1);
                else guildCount.increment("onlineUsers", 1);
            } else {
                guildCount.increment("offlineMembers", -1);
                if (user.bot) guildCount.increment("offlineBots", -1);
                else guildCount.increment("offlineUsers", -1);
            }
            updateCounter({client, guildSettings: guild.id});
        }
    });
};
