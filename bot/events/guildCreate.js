module.exports = client => {
    client.on('guildCreate', guild => {
        console.log(`[Bot shard #${client.shard.id}] Joined guild ${guild.name} (${guild.id})`);
    });
};