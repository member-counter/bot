const updateCounter = require("../utils/updateCounter");

module.exports = (client, member) => updateCounter({client , guildSettings: member.guild.id});
