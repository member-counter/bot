const GuildModel = require("../../mongooseModels/GuildModel");

const regionRelation = {
    brazil: "pt_BR"
};
module.exports = (bot, guild) => {
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