const updateCounter = require("../utils/updateCounter");

module.exports = (client, guild) => {
    const guildCounts = client.guildsCounts.get(guild.id);
    guildCounts.increment("roles", -1);
    updateCounter({client, guildSettings: guild.id});
}