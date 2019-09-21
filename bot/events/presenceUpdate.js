const updateCounter = require("../utils/updateCounter");

module.exports = client => {
    client.on("presenceUpdate", channel => {
        updateCounter(client, channel.guild.id, ["onlineusers", "offlineusers"]);
    });
};
