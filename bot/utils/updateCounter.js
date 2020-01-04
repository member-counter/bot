const fetchGuildSettings = require("../utils/fetchGuildSettings");
const updateCounter = require("./updateCounter/updateCounter");
const TIME_BETWEEN_EVERY_UPDATECOUNTER = parseInt(process.env.TIME_BETWEEN_EVERY_UPDATECOUNTER);

const updateCounterQueue = new Map();
const incrementValues = new Map();

/**
 * @param {Object} client Discord client
 * @param {(Object|string)} guild Mongoose GuildModel or Discord guild id
 * @param {Boolean} force Skips queue and updates all counters
 * @param {Object} increment
 */
module.exports = async ({client, guildSettings, force = false, incrementCounters = {}}) => {
    if (typeof guildSettings === "string")
        guildSettings = await fetchGuildSettings(guildSettings).catch(console.error);

    const { guild_id, premium_status } = guildSettings;

    let guildTimeBetweenEveryUpdate = TIME_BETWEEN_EVERY_UPDATECOUNTER * 1000;
    if (premium_status === 1) guildTimeBetweenEveryUpdate = 5 * 1000;
    if (premium_status === 2) guildTimeBetweenEveryUpdate = 1 * 1000;

    if (!incrementValues.has(guild_id)) incrementValues.set(guild_id, incrementCounters);
    else {
        let incrementValue = incrementValues.get(guild_id);
        for (let [key, value] of Object.entries(incrementCounters)) {
            if (incrementValue[key] === undefined) incrementValue[key] = 0;
            incrementValue[key] += value;
        }
    }


    if (force) {
        updateCounterQueue.delete(guild_id);
        incrementValues.delete(guild_id);
        updateCounter({client, guildSettings, force: true});
    } else if (!updateCounterQueue.has(guild_id)) {
        updateCounterQueue.set(guild_id, setTimeout(() => {
            updateCounterQueue.delete(guild_id);
            updateCounter({client, guildSettings, force , incrementCounters: incrementValues.get(guild_id)});
            incrementValues.delete(guild_id)
        }, guildTimeBetweenEveryUpdate));
    }
};
