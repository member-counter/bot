const GuildModel = require("../../mongooseModels/GuildModel");
const checkPremiumGuilds = require('../utils/checkPremiumGuilds');
const fetchGuildSettings = require('../utils/fetchGuildSettings');

const PREMIUM_BOT = JSON.parse(process.env.PREMIUM_BOT);
const { PREMIUM_BOT_ID } = process.env;

const regionRelation = {
    brazil: "pt_BR"
};

module.exports = (client, guild) => {
    if (!PREMIUM_BOT) {
        fetchGuildSettings(guild.id)
            .then(guildSettings => {
                client.getRESTGuildMember(guild.id, PREMIUM_BOT_ID)
                    .then(premiumBotMember => {
                        if (guildSettings.premium && premiumBotMember) guild.leave().catch(console.error);
                    })
                    .catch(console.error);
            })
            .catch(console.error)
    }

    checkPremiumGuilds(client);

    //set language for the guild based on its voice region
    if (regionRelation[guild.region]) {
        GuildModel.findOneAndUpdate(
            { guild_id: guild.id },
            { lang: regionRelation[guild.region] },
            { upsert: true }
        )
            .exec()
            .catch(console.error);
    }
}