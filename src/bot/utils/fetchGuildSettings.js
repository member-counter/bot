const GuildModel = require("../../mongooseModels/GuildModel");

/**
 * @description Performs GuildModel.findOneAndUpdate but without updating anything and has { new: true, upsert: true } options by default
 * @param {string} guildId - ID of the guild
 * @param {object} options = Any mongoose valid option for findOneAndUpdate
 * @returns {Promise} - Mongoose object
 */
const fetchGuildSettings = (guildId, options) => {
    return GuildModel.findOneAndUpdate(
        { guild_id: guildId },
        {},
        { new: true, upsert: true, ...options }
    );
};

module.exports = fetchGuildSettings;