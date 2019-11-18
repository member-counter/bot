const updateCounter = require("../utils/updateCounter");
const addTrack = require("../utils/addTrack");

module.exports = client => {
    client.on("guildMemberAdd", member => {
        addTrack(member.guild.id, "member_count_history", member.guild.memberCount);
        updateCounter(client, member.guild.id, ["members", "connectedusers"]);
    });
};
