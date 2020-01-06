const updateCounter = require("../utils/updateCounter");
const guildCounts = require("../utils/guildCounts");

module.exports = client => {
    client.on("roleDelete", role => {
        const guildCount = guildCounts.get(role.guild.id);
        guildCount.increment("roles", -1);
        updateCounter({client, guildSettings: role.guild.id});
    });
};
