const updateCounter = require("../utils/updateCounter");

module.exports = client => {
    client.on("guildMemberAdd", member => {
        updateCounter(client, member.guild.id);
    });
};
