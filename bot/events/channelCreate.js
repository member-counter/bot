const updateCounter = require("../utils/updateCounter");

module.exports = client => {
    client.on("channelCreate", channel => {
        if (channel.guild) updateCounter(client, channel.guild.id, ["channels"]);
    });
};