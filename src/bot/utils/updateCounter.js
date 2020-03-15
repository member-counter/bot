const fetchGuildSettings = require("./fetchGuildSettings");
const updateCounter = require("./updateCounter/_updateCounter");
const TIME_BETWEEN_EVERY_UPDATECOUNTER = parseInt(process.env.TIME_BETWEEN_EVERY_UPDATECOUNTER);

const updateCounterQueue = new Map();

/**
 * @param {(Object|string)} guild Mongoose GuildModel or Discord guild id
 * @param {Boolean} force Skips queue and updates all counters
 */
module.exports = async ({ client, guildSettings, force = false }) => {
    if (typeof guildSettings === "string")
        guildSettings = await fetchGuildSettings(guildSettings).catch(console.error);

    const { guild_id } = guildSettings;

    const areGuildCountersBeingUpdated = updateCounterQueue.get(guild_id);

    if (!areGuildCountersBeingUpdated) {
        updateCounterQueue.set(guild_id, true);
        await updateCounter({ client, guildSettings, force });
        updateCounterQueue.set(guild_id, false);
    }
};
