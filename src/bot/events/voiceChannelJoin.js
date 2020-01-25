const updateCounter = require("../utils/updateCounter");

module.exports = (bot, member) => updateCounter({bot , guildSettings: member.guild.id});
