module.exports = client => {
    client.on("guildDelete", guild => {
        console.log(
            `[Bot shard #${client.shard.id}] Joined guild ${guild.name} (${guild.id})`
        );
    });
};
