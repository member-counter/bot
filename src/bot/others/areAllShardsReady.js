module.exports = (stats) => {
    const { clusters } = stats;

    if (clusters.length === 0) return false;

    let shards = 0;
    let shardsReady = 0;
    let shardStatsInClusters = 0;

    clusters.forEach(cluster => {
        shards += cluster.shards;
        shardStatsInClusters += cluster.shardsStats.length;

        cluster.shardsStats.forEach(shardStats => {
            if (shardStats.status === "ready") ++shardsReady;
        })
    });
    
    
    return (shards === shardStatsInClusters && shards === shardsReady);
}
