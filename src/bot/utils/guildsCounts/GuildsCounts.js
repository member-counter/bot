const CountSet = require("./CountSet");

class GuildCounts {
    constructor(bot) {
        this.bot = bot;
        this._guildCounts = new Map();
    }

    /**
     * @param {String} guildId 
     * @returns {CountSet}
     */
    get(guildId) {
        if (!this._guildCounts.has(guildId))
            this._guildCounts.set(guildId, new CountSet(this.bot, guildId));
        return this._guildCounts.get(guildId);
    }

    /**
     * 
     * @param {String} guildId 
     * @returns {Boolean}
     */
    delete(guildId) {
        return this._guildCounts.delete(guildId);
    }
}

module.exports = GuildCounts;