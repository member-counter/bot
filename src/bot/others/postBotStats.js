const { DISCORD_CLIENT_ID, DBL_TOKEN, DBGG_TOKEN, DBOATS_TOKEN, DBWORLD_TOKEN, BOND_TOKEN, BFD_TOKEN, SEND_BOT_STATS } = process.env;
const fetch = require("node-fetch");

const areAllShardsReady = (data) => {
    const { clusters } = data;
    let shards = 0;
    let shardsReady = 0;

    clusters.forEach(cluster => {
        if (cluster.shardsStats.length !== cluster.shards) return false;

        cluster.shardsStats.forEach(shardStats => {
            shards += shardStats.shards;
            if (shardStats.status === "ready") ++shardsReady;
        })
    });

    return (shards === shardsReady);
}

module.exports = (data) => {
    if (JSON.parse(SEND_BOT_STATS) && areAllShardsReady(data)) {
        const guildCount = data.guilds;

        //https://discord.bots.gg
        fetch(`https://discord.bots.gg/api/v1/bots/${DISCORD_CLIENT_ID}/stats`, {
            method: "post",
            headers: {
                Authorization: DBGG_TOKEN,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ guildCount })
        })
            .then(response => console.log(`[STATS SENDER] [discord.bots.gg] Stats sent, response: ${response.status}`))
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
            .then(response => console.log(`[STATS SENDER] [top.gg] Stats sent, response: ${response.status}`))
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
            .then(response => console.log(`[STATS SENDER] [discord.boats] Stats sent, response: ${response.status}`))
            .catch(console.error);

        //https://discordbot.world
        fetch(` https://discordbot.world/api/bot/${DISCORD_CLIENT_ID}/stats`, {
            method: "post",
            headers: {
                Authorization: DBWORLD_TOKEN,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ guild_count: guildCount })
        })
            .then(response => console.log(`[STATS SENDER] [discordbot.world] Stats sent, response: ${response.status}`))
            .catch(console.error);

        //https://bots.ondiscord.xyz/
        fetch(`https://bots.ondiscord.xyz/bot-api/bots/${DISCORD_CLIENT_ID}/guilds`, {
            method: "post",
            headers: {
                Authorization: BOND_TOKEN,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ guildCount })
        })
            .then(response => console.log(`[STATS SENDER] [bots.ondiscord.xyz] Stats sent, response: ${response.status}`))
            .catch(console.error);
        
        //https://botsfordiscord.com
        fetch(`https://botsfordiscord.com/api/bot/${DISCORD_CLIENT_ID}`, {
            method: "post",
            headers: {
                Authorization: BFD_TOKEN,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ server_count: guildCount })
        })
            .then(response => console.log(`[STATS SENDER] [botsfordiscord.com] Stats sent, response: ${response.status}`))
            .catch(console.error);
    }
}