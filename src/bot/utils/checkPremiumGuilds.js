const PREMIUM_BOT = JSON.parse(process.env.PREMIUM_BOT);
const fetchGuildSettings = require('../utils/fetchGuildSettings');

module.exports = (client) => {
    if (PREMIUM_BOT) {
        client.guilds.forEach(guild => {
            fetchGuildSettings(guild.id)
                .then(guildsSettings => {
                    if (!guildsSettings.premium) guild.leave().catch(console.error);
                })
                .catch(console.error);
        });
    }
};
