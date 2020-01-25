const updateCounter = require("../utils/updateCounter");

module.exports = (bot, guild, member) => {
    const guildCounts = bot.guildsCounts.get(guild.id);

    guildCounts.increment("members", -1);

    if (member.user.bot) guildCounts.increment("bots", -1);
    else guildCounts.increment("users", -1);

    if (member.status === "online") {
        guildCounts.increment("onlineMembers", -1);
        if (member.user.bot) guildCounts.increment("onlineBots", -1);
        else guildCounts.increment("onlineUsers", -1);
    } else {
        guildCounts.increment("offlineMembers", -1);
        if (member.user.bot) guildCounts.increment("offlineBots", -1);
        else guildCounts.increment("offlineUsers", -1);
    }
    
    updateCounter({bot, guildSettings: guild.id});
};