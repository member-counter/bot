const updateCounter = require("../utils/updateCounter");

const TIME_BETWEEN_EVERY_UPDATE = 5 * 1000;
const GuildsToUpdate = new Map();

module.exports = client => {
    client.on("presenceUpdate", (oldMember, newMember) => {
        if (oldMember.presence.status !== "offline") oldMember.presence.status = "online";
        if (newMember.presence.status !== "offline") newMember.presence.status = "online";
        if (oldMember.presence.status !== newMember.presence.status) {
            if (!GuildsToUpdate.has(newMember.guild.id)) 
                GuildsToUpdate.set(newMember.guild.id, setTimeout(() => {
                    updateCounter(client, newMember.guild.id, ["onlineusers", "offlineusers"]);
                    GuildsToUpdate.delete(newMember.guild.id);
                }, TIME_BETWEEN_EVERY_UPDATE));
        }
    });
};
