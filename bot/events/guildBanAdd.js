const updateCounter = require("../utils/updateCounter");

module.exports = client => {
    client.on("guildBanAdd", guild => {
        updateCounter({client, guildSettings: guild.id});
    });
};
