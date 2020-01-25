const updateCounter = require("../utils/updateCounter");

module.exports = (bot, guild) => {
    const guildCounts = bot.guildsCounts.get(guild.id);
    guildCounts.increment("roles", 1);
    updateCounter({bot, guildSettings: guild.id});
}