const updateCounter = require("../utils/updateCounter");

module.exports = client => {
    client.on("guildMemberAdd", member => {
        let increment = {
            members: 1
        };
        
        if (member.user.bot) increment.bots = 1;
        else increment.users = 1;
        updateCounter({client, guildSettings: member.guild.id, incrementCounters: increment});
    });
};
