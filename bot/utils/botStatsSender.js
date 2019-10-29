const INTERVAL_STATS_TIME = 15 * 60 * 60;
const { DISCORD_CLIENT_ID, DBL_TOKEN, DBGG_TOKEN, DBOATS_TOKEN } = process.env;
const fetch = require("node-fetch");
const getTotalGuildsAndMembers = require("./getTotalGuildsAndMembers");

module.exports = client => {
    if (client.shard.id === 0) {
        setInterval(async () => {
            const guildCount = await getTotalGuildsAndMembers(client).totalGuilds;

            //https://discord.bots.gg
            fetch(`https://discord.bots.gg/api/v1/bots/${DISCORD_CLIENT_ID}/stats`, {
                method: "post",
                headers: {
                    Authorization: DBGG_TOKEN,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ guildCount })
            })
                .then(response => response.json())
                .then(console.log)
                .catch(console.error);

            //https://top.gg/
            fetch(`https://top.gg/api/bots/${DISCORD_CLIENT_ID}/stats`, {
                method: "post",
                headers: {
                    Authorization: DBL_TOKEN,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ server_count: guildCount })
            })
                .then(response => response.json())
                .then(console.log)
                .catch(console.error);

            //https://discord.boats/
            fetch(`https://discord.boats/api/v2/bot/${DISCORD_CLIENT_ID}`, {
                method: "post",
                headers: {
                    Authorization: DBOATS_TOKEN,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ server_count: guildCount })
            })
                .then(response => response.json())
                .then(console.log)
                .catch(console.error);

        }, INTERVAL_STATS_TIME);
    }
};
