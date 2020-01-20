const { DISCORD_PREFIX } = process.env;

module.exports = (client) => {
    client.editStatus("online", {
        name: `${DISCORD_PREFIX}help`,
        type: 3
    });
}