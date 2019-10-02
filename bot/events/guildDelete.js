module.exports = client => {
    client.on('guildDelete', guild => {
        console.log(`[Bot shard #${client.shard.id}] Left guild ${guild.name} (${guild.id}), shard guilds-users: ${client.guilds.size}-${client.users.size}`);
    });
};