const updateCounter = require("../utils/updateCounter");

module.exports = client => {
    client.on("voiceStateUpdate", (oldMember, newMember) => {
        let newUserChannel = newMember.voiceChannel;
        let oldUserChannel = oldMember.voiceChannel;

        if (oldUserChannel === undefined && newUserChannel !== undefined) {
            updateCounter(client, newUserChannel.guild.id, ["connectedusers"]);
        } else if (newUserChannel === undefined) {
            updateCounter(client, oldUserChannel.guild.id, ["connectedusers"]);
        }
    });
};
