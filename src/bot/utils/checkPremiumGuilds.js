const PREMIUM_BOT = JSON.parse(process.env.PREMIUM_BOT);
const fetchGuildSettings

module.exports = (client) => {
    if (PREMIUM_BOT) {
        client.guilds.forEach(guild => {
            // todo
        });
    }
};
