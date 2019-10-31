module.exports = client => {
    client.on("warn", warn => {
        console.log(`[Bot shard #${client.shard.id}] ${warn}`);
    });
};
