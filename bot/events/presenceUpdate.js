const updateCounter = require("../utils/updateCounter");

const TIME_BETWEEN_EVERY_UPDATE = 20 * 1000;
const GuildsToUpdate = new Map();
const wait = ms => new Promise((resolve)=>setTimeout(resolve, ms));

module.exports = client => {
    client.on("presenceUpdate", (oldMember, newMember) => {
        GuildsToUpdate.set(newMember.guild.id);
    });

    setInterval(() => {
        GuildsToUpdate.forEach(async (value, guild_id) => {
            updateCounter(client, guild_id, ["onlineusers", "offlineusers"]);
            await wait(TIME_BETWEEN_EVERY_UPDATE / client.guilds.size);
        });
        GuildsToUpdate.clear();
    }, TIME_BETWEEN_EVERY_UPDATE);
};
