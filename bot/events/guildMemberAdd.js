const updateCounter = require("../utils/updateCounter");

module.exports = client => {
    client.on("guildMemberAdd", member => {
        console.log("guildMemberAdd", member.user.tag)
        let increment = {
            members: 1
        };
        let isBot = member.user.bot;
        if (isBot) increment = {...increment, bots: 1}
        else increment = {...increment, users: 1}
        updateCounter({client, guildSettings: member.guild.id, incrementCounters: increment});
    });
};
