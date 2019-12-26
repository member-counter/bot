const fetchGuildSettings = require("../utils/fetchGuildSettings");
const updateCounter = require("./updateCounter/functions/updateCounter");
const TIME_BETWEEN_EVERY_UPDATECOUNTER = parseInt(process.env.TIME_BETWEEN_EVERY_UPDATECOUNTER);

const updateCounterQueue = new Map();

/**
 * This is what actually updates the counters, the module.exports is just a queue
 * @param {Object} client Discord client
 * @param {(Object|string)} guild Mongoose GuildModel or Discord guild id
 * @param {Boolean} force Skips queue and updates all counters 
 */
module.exports = async (client, guildSettings, force = false) => {
    if (typeof guildSettings === "string")
        guildSettings = await fetchGuildSettings(guildSettings).catch(console.error);

    const { guild_id, premium_status } = guildSettings;

    let guildTimeBetweenEveryUpdate = TIME_BETWEEN_EVERY_UPDATECOUNTER * 1000;
    if (premium_status === 1) guildTimeBetweenEveryUpdate = 5 * 1000;
    if (premium_status === 2) guildTimeBetweenEveryUpdate = 1 * 1000;

    if (force) {
        updateCounterQueue.delete(guild_id);
        updateCounter(client, guildSettings, force);
        
    } else if (!updateCounterQueue.has(guild_id)) {
        updateCounterQueue.set(guild_id, setTimeout(() => {
            updateCounter(client, guildSettings, force);
            updateCounterQueue.delete(guild_id);
        }, guildTimeBetweenEveryUpdate));
    }
};
