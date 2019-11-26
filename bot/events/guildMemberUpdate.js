const updateCounter = require("../utils/updateCounter");

module.exports = client => {
    client.on("guildMemberUpdate", (_, member) => {
        updateCounter(client, member.guild.id, ["memberswithrole"]); //connectedusers removed, restore if it gives problems
    });
};
