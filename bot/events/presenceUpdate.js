const updateCounter = require("../utils/updateCounter");

module.exports = client => {
    client.on("presenceUpdate", () => {
        //updateCounter(client, channel.guild.id, ["onlineusers", "offlineusers"]);
    });
};
