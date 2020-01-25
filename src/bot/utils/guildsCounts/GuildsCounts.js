const CountSet = require("./CountSet");

class GuildCounts {
    constructor(client) {
        this.client = client;
        this._guildCounts = new Map();
    }

    /**
     * @param {String} guildId 
     * @returns {CountSet}
     */
    get(guildId) {
        if (!this._guildCounts.has(guildId))
            this._guildCounts.set(guildId, new CountSet(this.client, guildId));
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