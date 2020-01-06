const updateCounter = require("../utils/updateCounter");
const guildCounts = require("../utils/guildCounts");

module.exports = client => {
    client.on("guildMemberAdd", member => {
        const guildCount = guildCounts.get(member.guild.id);
        guildCount.increment("members", 1);

        if (member.user.bot) guildCount.increment("bots", 1);
        else guildCount.increment("users", 1);

        updateCounter({client, guildSettings: member.guild.id});
    });
};
