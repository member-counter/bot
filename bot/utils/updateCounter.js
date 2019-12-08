const fetchGuildSettings = require("../utils/fetchGuildSettings");
const updateMembersCounter = require("./updateCounter/members");
const updateRolesCounter = require("./updateCounter/roles");
const updateChannelsCounter = require("./updateCounter/channels");
const updateConnectedUsers = require("./updateCounter/connectedUsers");
const updateMembersWithRole = require("./updateCounter/memberswithrole");
const updateBannedMembersCount = require("./updateCounter/bannedMembers");

const counters = {
    members: updateMembersCounter,
    roles: updateRolesCounter,
    channels: updateChannelsCounter,
    connectedusers: updateConnectedUsers,
    memberswithrole: updateMembersWithRole,
    bannedmembers: updateBannedMembersCount
};

/**
 * @param {Object} client Discord client
 * @param {(Object|string)} guild Mongoose GuildModel or Discord guild id
 * @param {string[]=} types Type of counters to update
 */

module.exports = async (client, guild, types = ["members"]) => {
    if (typeof guild === "string")
        guild = await fetchGuildSettings(guild).catch(console.error);
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
