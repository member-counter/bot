const updateCounter = require("../utils/updateCounter");
const wait = require("../utils/wait");

const TIME_BETWEEN_EVERY_UPDATE = 1 * 1000;
const GuildsToUpdate = new Map();

module.exports = client => {
    client.on("presenceUpdate", (oldMember, newMember) => {
        if (oldMember.presence.status !== newMember.presence.status) GuildsToUpdate.set(newMember.guild.id);
    });

    setInterval(() => {
        GuildsToUpdate.forEach(async (value, guild_id) => {
            updateCounter(client, guild_id, ["onlineusers", "offlineusers"]);
        });
        GuildsToUpdate.clear();
    }, TIME_BETWEEN_EVERY_UPDATE);
};
