const updateCounter = require("../utils/updateCounter");
const addTrack = require("../utils/addTrack");

module.exports = client => {
    client.on("guildMemberRemove", member => {
        updateCounter(client, member.guild.id, ["members", "connectedusers"]);
        addTrack(member);
    });
};
