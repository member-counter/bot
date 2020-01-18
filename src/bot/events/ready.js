module.exports = (client) => {

    // const botStatsSender = require("../utils/botStatsSender");

    // console.log(`[Bot shard #${client.shard.id}] Discord client ready`);
    // console.log(
    //     `[Bot shard #${client.shard.id}] Serving on ${client.guilds.size} servers, for ${client.users.size} users as ${client.user.username}#${client.user.discriminator}`
    // );
    
    // botStatsSender(bot);
    setStatus(client);
    
    // setInterval(() => {
    //     // botStatsSender(client);
    //     setStatus(client);
    // }, 15 * 60 * 1000);
};

const setStatus = (client) => {
    client.editStatus("online", {
        name: `${process.env.DISCORD_PREFIX}help`,
        type: 3,
        url: "https://member-counter.eduardozgz.com"
    });
}