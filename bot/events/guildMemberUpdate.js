const updateCounter = require("../utils/updateCounter");

module.exports = client => {
    client.on("guildMemberUpdate", (_, member) => {
        updateCounter({client, guildSettings: member.guild.id});
    });
};
