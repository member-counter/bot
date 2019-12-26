const updateCounter = require("../utils/updateCounter");

module.exports = client => {
    client.on("roleCreate", channel => {
        updateCounter(client, channel.guild.id);
    });
};
