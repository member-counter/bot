const setStatus = require("../others/setStatus");
const postBotStats = require("../others/postBotStats");

module.exports = (client) => {
    console.log(`Eris ready! Serving to ${client.users.size} users in ${client.guilds.size} guilds`);

    setStatus(client);
    postBotStats(client);

    setInterval(() => {
        console.log(`Serving to ${client.users.size} users in ${client.guilds.size} guilds`);
        setStatus(client);
        postBotStats(client);
    }, 5 * 60 * 1000);

    setInterval(() => {
        // TODO check guilds (the premium shit)
    }, 1 * 60 * 1000);
};