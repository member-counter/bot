const GuildModel = require("../../mongooseModels/GuildModel");
const updateMembersCounter = require("./updateCounter/members");
const updateRolesCounter = require("./updateCounter/roles");
const updateChannelsCounter = require("./updateCounter/channels");
const updateConnectedUsers = require("./updateCounter/connectedUsers");

const counters = {
    members: updateMembersCounter,
    roles: updateRolesCounter,
    channels: updateChannelsCounter,
    connectedusers: updateConnectedUsers
};

/**
 * @param {Object} client Discord client
 * @param {(Object|string)} guild Mongoose GuildModel or Discord guild id
 * @param {string[]=} types Type of counters to update
 */

module.exports = async (client, guild, types = ["members"]) => {
    if (typeof guild === "string")
        guild = await fetchGuildSettings(guild);
    if (typeof guild === "object") {
        if (types === "all" || types.includes("all")) {
            Object.entries(counters).forEach(counter => {
                counter[1](client, guild, types);
            });
        } else {
            types.forEach(type => {
                if (counters[type]) counters[type](client, guild, types);
            });
        }
    }
};

const fetchGuildSettings = guild_id => {
    return new Promise(resolve => {
        GuildModel.findOneAndUpdate(
            { guild_id },
            {},
            { new: true, upsert: true }
        )
            .then(resolve)
            .catch(error => {
                console.error(error);
                resolve("error");
            });
    });
};
