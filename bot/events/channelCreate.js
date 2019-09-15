const updateCounter = require("../utils/updateCounter");

module.exports = client => {
    client.on("channelCreate", channel => {
        if (channel.type !== "dm" || channel.type !== "group") updateCounter(client, channel.guild.id, ["channels"]);
    });
};