const updateMembersCounter = require("./updateCounter/members");
const updateUsersCounter = require("./updateCounter/users");
const updateBotsCounter = require("./updateCounter/bots");
const updateRolesCounter = require("./updateCounter/roles");
const updateChannelsCounter = require("./updateCounter/channels");
const updateOnlineUsersCounter = require("./updateCounter/onlineUsers");
const updateOfflineUsers = require("./updateCounter/offlineUsers");
const updateConnectedUsers = require("./updateCounter/connectedUsers");

const counters = {
    members: updateMembersCounter,
    users: updateUsersCounter,
    bots: updateBotsCounter,
    roles: updateRolesCounter,
    channels: updateChannelsCounter,
    onlineusers: updateOnlineUsersCounter,
    offlineusers: updateOfflineUsers,
    connectedusers: updateConnectedUsers
};

module.exports = (client, channel_id, types = ["members"]) => {
    if (types === "all" || types.includes("all")) {
        Object.entries(counters).forEach(counter => {
            //counter is a key-value pair
            counter[1](client, channel_id);
        });
    } else {
        types.forEach(type => {
            if (counters[type]) counters[type](client, channel_id);
        });
    }
};
