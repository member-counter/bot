/**
 * @param {client}
 * @returns {Promise.<{ totalGuilds: number, totalCachedUsers: number }>}
 */
module.exports = client => {
    return new Promise(resove => {
        const promises = [
            client.shard.fetchClientValues("guilds.size"),
            client.shard.fetchClientValues("users.size")
        ];
    
        Promise.all(promises)
            .then(results => {
                const totalGuilds = results[0].reduce(
                    (prev, guildCount) => prev + guildCount,
                    0
                );
                const totalCachedUsers = results[1].reduce(
                    (prev, userCount) => prev + userCount,
                    0
                );
                resove({ totalGuilds, totalCachedUsers });
            })
            .catch(error => {
                resolve({ totalGuilds: 0, totalCachedUsers: 0 });
                console.error(error);
            });
    });
};
