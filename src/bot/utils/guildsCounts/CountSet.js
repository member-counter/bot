const { generateBaseCounts } = require("./fetchCounts");

class CountSet {
    constructor(client, guildId) {
        this.client = client;
        this.guildId = guildId;
        this._counts = {
           ...generateBaseCounts(client, guildId)
        }
    }

    /**
     * @param {String} countName 
     * @param {Number} value 
     * @returns {Number}
     */
    increment(countName, value) {
        this._counts[countName] += value;
        if (this._counts[countName] < 0)
            this._counts[countName] = 0;
        return this._counts[countName];
    }

    /**
     * @param {String} countName 
     * @returns {Number}
     */
    get(countName) {
        return this._counts[countName];
    }

    /**
     * @returns {Object}
     */
    get counts() {
        return this._counts;
    }
}

module.exports = CountSet;