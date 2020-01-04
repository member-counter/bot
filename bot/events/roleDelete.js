const updateCounter = require("../utils/updateCounter");

module.exports = client => {
    client.on("roleDelete", role => {
        updateCounter({client, guildSettings: role.guild.id, incrementCounters: {roles: -1}});
    });
};
