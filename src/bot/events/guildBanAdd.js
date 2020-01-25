const updateCounter = require("../utils/updateCounter");

module.exports = (client, guild) => {
    updateCounter({client, guildSettings: guild.id});
};