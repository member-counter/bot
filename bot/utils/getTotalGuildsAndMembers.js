/**
 * @param {client}
 * @returns {Promise.<{ totalGuilds: number, totalMembers: number }>}
 */
module.exports = client => {
    return new Promise(resove => {
        const promises = [
            client.shard.fetchClientValues("guilds.size"),
            client.shard.broadcastEval("this.guilds.reduce((prev, guild) => prev + guild.memberCount, 0)")
        ];
    
        Promise.all(promises)
            .then(results => {
                const totalGuilds = results[0].reduce(
                    (prev, guildCount) => prev + guildCount,
                    0
                );
                const totalMembers = results[1].reduce(
                    (prev, memberCount) => prev + memberCount,
                    0
                );
                resove({ totalGuilds, totalMembers });
            })
            .catch(error => {
                resolve({ totalGuilds: 0, totalMembers: 0 });
                console.error(error);
            });
    });
};
