const updateCounter = require("../utils/updateCounter");

module.exports = client => {
    client.on("presenceUpdate", (oldMember, newMember) => {
        if (oldMember.presence.status !== newMember.presence.status) updateCounter(client, guild_id, ["onlineusers", "offlineusers"]);
    });
};
