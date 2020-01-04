const updateCounter = require("../utils/updateCounter");

module.exports = client => {
    client.on("guildBanRemove", guild => {
        updateCounter({client, guildSettings: guild.id});
    });
};
