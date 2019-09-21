const updateCounter = require("../utils/updateCounter");

module.exports = client => {
    client.on("presenceUpdate", (oldMember, newMember) => {
        if (oldMember.presence.status !== newMember.presence.status) updateCounter(client, newMember.guild.id, ["onlineusers", "offlineusers"]);
    });
};
