const updateCounter = require("../utils/updateCounter");

const TIME_BETWEEN_EVERY_UPDATE = 10 * 1000;
const GuildsToUpdate = new Map();

module.exports = client => {
    client.on("presenceUpdate", (oldMember, newMember) => {
        GuildsToUpdate.set(newMember.guild.id);
    });

    setInterval(() => {
        GuildsToUpdate.forEach((value, guild_id) => {
            updateCounter(client, guild_id, ["onlineusers", "offlineusers"]);
        });
        GuildsToUpdate.clear();
    }, TIME_BETWEEN_EVERY_UPDATE);
};
