const fetchGuildSettings = require("./fetchGuildSettings");
const updateCounter = require("./updateCounter/_updateCounter");

const updateCounterStatus = new Map();

/**
 * @param {(Object|string)} guild Mongoose GuildModel or Discord guild id
 * @returns {Boolean} Returns a bool indication if it's already being updated.
 */
module.exports = async ({ client, guildSettings }) => {
    if (typeof guildSettings === "string") {
        guildSettings = await fetchGuildSettings(guildSettings);
    }

    const { guild_id } = guildSettings;

    const areGuildCountersBeingUpdated = updateCounterStatus.get(guild_id);

    if (!areGuildCountersBeingUpdated) {
        updateCounterStatus.set(guild_id, true);
        await updateCounter({ client, guildSettings }).catch(console.error);
        updateCounterStatus.set(guild_id, false);
    }

    return areGuildCountersBeingUpdated;
};
