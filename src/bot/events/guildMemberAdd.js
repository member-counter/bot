const updateCounter = require("../utils/updateCounter");

module.exports = (client, guild) => {

    // TODO if premium bot joined && guild is premium; then apply patchs in enabled channels
    updateCounter({client, guildSettings: guild.id});
};