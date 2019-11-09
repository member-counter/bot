module.exports = client => {
    client.on("reconnecting", () => {
        console.log(`[Bot shard #${client.shard.id}] Reconnecting...`);
    });
};
