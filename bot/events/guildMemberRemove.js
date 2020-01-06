const updateCounter = require("../utils/updateCounter");
const guildCounts = require("../utils/guildCounts");

module.exports = client => {
    client.on("guildMemberRemove", member => {
        const guildCount = guildCounts.get(member.guild.id);

        guildCount.increment("members", -1);

        if (member.user.bot) guildCount.increment("bots", -1);
        else guildCount.increment("users", -1);

        if (member.presence.status === "online") {
            guildCount.increment("onlineMembers", -1);
            if (member.user.bot) guildCount.increment("onlineBots", -1);
            else guildCount.increment("onlineUsers", -1);
        } else {
            guildCount.increment("offlineMembers", -1);
            if (member.user.bot) guildCount.increment("offlineBots", -1);
            else guildCount.increment("offlineUsers", -1);
        }
        
        updateCounter({client, guildSettings: member.guild.id});
    });
};
