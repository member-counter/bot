const updateCounter = require("../utils/updateCounter");

module.exports = (bot, guild) => {
    updateCounter({bot, guildSettings: guild.id});
};