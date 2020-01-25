const updateCounter = require("../utils/updateCounter");

module.exports = (bot, member, oldMember) => {
    const { guild, user } = member;
    let newStatus = member.status;
    let oldStatus = oldMember.status;

    //convert dnd/idle to online
    if (oldStatus !== "offline") oldStatus = "online";
    if (newStatus !== "offline") newStatus = "online";

    if (oldStatus !== newStatus) {
        const guildCounts = bot.guildsCounts.get(guild.id);

        if (newStatus === "online") {
            guildCounts.increment("onlineMembers", 1);
            if (user.bot) guildCounts.increment("onlineBots", 1);
            else guildCounts.increment("onlineUsers", 1);
        } else {
            guildCounts.increment("offlineMembers", -1);
            if (user.bot) guildCounts.increment("offlineBots", -1);
            else guildCounts.increment("offlineUsers", -1);
        }
        updateCounter({bot, guildSettings: guild.id});
    }
}