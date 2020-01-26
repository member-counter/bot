const {
    DISCORD_OFFICIAL_SERVER_ID,
    REWARD_ROLE_ID
} = process.env;

/**
 * @param {string} user Discord user id
 * @param {object} client
 */
module.exports = (userId, client) => {
    
    const officialServer = client.guilds.get(DISCORD_OFFICIAL_SERVER_ID);
    const member = officialServer.members.get(userId);

    if (officialServer && !officialServer.unavailable && member) {
        member.addRole(REWARD_ROLE_ID)
            .then(() => {
                console.log("[API] Upvoter Role given successfully to " + userId);
            })
            .catch(error => {
                console.error("[API] Error while trying to give the upvoter role to " + userId + ", Error code: " + error.code);
            });
    }
};