const updateCounter = require("../utils/updateCounter");

module.exports = (client, guild, member) => {
    updateCounter({client, guildSettings: guild.id});
};