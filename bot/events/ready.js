const updateCounter = require("../utils/updateCounter");
const wait = require("../utils/wait");

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

    //update all the counters at startup
    const updateCounters = async () => {
        while (client.guilds.size === 0) await wait(5000);
        client.guilds.forEach(guild => {
            updateCounter(client, guild.id, ["all"]);
        });
    };
    updateCounters();
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
