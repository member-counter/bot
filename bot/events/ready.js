const updateCounter = require("../utils/updateCounter");

module.exports = client => {
    client.on("ready", () => {
        console.log(`[Bot shard #${client.shard.id}] Discord client ready`);
        console.log(
            `[Bot shard #${client.shard.id}] Serving on ${client.guilds.size} servers, for ${client.users.size} users as ${client.user.tag}`
        );

        setPresence(client);
        
        setInterval(() => {
            setPresence(client);
        }, 15 * 60 * 1000);
    });
};

const setPresence = client => {
    client.user
        .setPresence({
            game: {
                name: `type ${process.env.DISCORD_PREFIX}help`,
                type: "PLAYING"
            }
        })
        .then(() =>
            console.log(
                `[Bot shard #${client.shard.id}] Presence updated successfully`
            )
        )
        .catch(console.error);
};
