module.exports = client => {
    client.on("resume", () => {
        console.log(`[Bot shard #${client.shard.id}] Connection resumed`);
    });
};
