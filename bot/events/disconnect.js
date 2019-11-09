module.exports = client => {
    client.on("disconnect", () => {
        console.log(`[Bot shard #${client.shard.id}] Disconnected`);
    });
};
