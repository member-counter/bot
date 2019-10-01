const updateCounter = require("../utils/updateCounter");
const addTrack = require("../utils/addTrack");

module.exports = client => {
    client.on("guildMemberAdd", member => {
        updateCounter(client, member.guild.id, ["users", "bots", "members", "onlineusers", "offlineusers", "connectedusers"]);
        addTrack(member);
    });
};
