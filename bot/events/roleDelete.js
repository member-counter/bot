const updateCounter = require("../utils/updateCounter");

module.exports = client => {
    client.on("roleDelete", channel => {
        updateCounter(client, channel.guild.id);
    });
};
