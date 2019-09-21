const updateCounter = require("../utils/updateCounter");

module.exports = client => {
    client.on("presenceUpdate", (oldMember, newMember) => {
        updateCounter(client, oldMember.guild.id, ["onlineusers", "offlineusers"]);
    });
};
