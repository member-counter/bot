const updateCounter = require("../utils/updateCounter");

module.exports = client => {
    client.on("voiceStateUpdate", (oldMember, newMember) => {
        let newUserChannel = newMember.voiceChannel;
        let oldUserChannel = oldMember.voiceChannel;

        if (oldUserChannel === undefined && newUserChannel !== undefined) {
            //join
            updateCounter({client, guildSettings: newMember.guild.id});
        } else if (newUserChannel === undefined && oldUserChannel) {
            //leave
            updateCounter({client, guildSettings: newMember.guild.id});
        }
    });
};
